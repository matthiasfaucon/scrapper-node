import puppeteer from 'puppeteer';
import fs from 'fs';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Resend } from 'resend';
import 'dotenv/config';

const fastify = Fastify({
	logger: true,
})

const email_resend = process.env.EMAIL_RESEND;
const api_key = process.env.TOKEN_RESEND;

fastify.register(cors);

// Get all the apartments from the files
fastify.get('/api/apartments', async () => {
    const dir = './datas';
    const files = fs.readdirSync(dir);
    const apartments = {}; // Modifié ici

    for (const file of files) {
        // regex to extract the date from the filename
        const timestamp = file.match(/\d+/)[0];
		let date = new Date(parseInt(timestamp));
		date = date.toLocaleDateString('fr-FR');

        const data = fs.readFileSync(dir + '/' + file);
        const apartmentsData = JSON.parse(data);
        if (apartments[date] === undefined) {
            apartments[date] = [];
        }
        apartments[date].push(...apartmentsData);
    }
    // console.log(apartments);
    return apartments;
});

fastify.post('/api/scraping', async (request, reply) => {
    try {
        const { type, city, budget, rooms, area } = request.body;
	
		const tab = [];

		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		page.setViewport({ width: 1920, height: 1080 });

		await entryOnSite('https://www.bienici.com/recherche/location/france/appartement', '#didomi-notice-agree-button', '.resultsListContainer', page);

		await page.waitForSelector('.searchTypePicker');
		await page.click('.searchTypePicker');
		await page.waitForSelector("[role='listbox']");
		const searchTypeElements = type === 'rent' ? "[data-original-index='1']" : "[data-original-index='0']";
		await page.click(searchTypeElements);

		await page.waitForSelector('.tt-input');
		await page.type('.tt-input', city);
		await page.keyboard.press('Enter');

		await page.click("[name='minMaxPrice']");
		await page.waitForSelector("[name='minPrice']");
		await page.type("[name='minPrice']", budget.min.toString());
		await page.type("[name='maxPrice']", budget.max.toString());

		await page.click("[name='minMaxRooms']");
		await page.waitForSelector("[name='minRooms']");
		await page.type("[name='minRooms']", rooms.min.toString());
		await page.type("[name='maxRooms']", rooms.max.toString());

		await page.click("[name='minMaxArea']");
		await page.waitForSelector("[name='minArea']");
		await page.type("[name='minArea']", area.min.toString());
		await page.type("[name='maxArea']", area.max.toString());

		await page.keyboard.press('Enter');
		await page.waitForNavigation();
		
		try {
			await page.waitForSelector('.resultsListContainer');
		} catch (error) {
			console.log('No results found');
			await browser.close();
			await reply.code(400).send({ error: 'Aucun résultats trouvé' });
			return
		}
		
		const paginationLinks = await page.$$eval('.pagination__clickable-page-index', links => links.map(link => link.href));

		console.log(paginationLinks);
		if (paginationLinks.length === 0) {
			console.log('No pagination found');
			const apartments = await scrapePage(page);
			tab.push(...apartments);
		} else {
			for (const link of paginationLinks) {
				console.log('Scraping:', link);
				try {
					await new Promise((resolve) => setTimeout(resolve, 2000));
					page.goto(link, { timeout: 0 });
				} catch (error) {
					console.log('Error navigating to page:', error);
					continue;
				}

				await page.waitForSelector('.resultsListContainer');
				const apartments = await scrapePage(page);
				tab.push(...apartments);
			}
		}

		let mailBody = ''
		tab.forEach((ele) => {
			mailBody += `<div>
			<img src="${ele.img}" alt="img" style="width: 100px; height: 100px;">
			<h3>${ele.title}</h3>
			<p>${ele.price}</p>
			<a href="${ele.link}">Voir l'annonce</a>
			<hr>	
			<div>
			<br>`;
		});

		const resend = new Resend(api_key);

		await reply.send({ data: tab })
		await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: email_resend,
			subject: "Résulats de votre recherche LogiScrap - " + tab.length + " annonces trouvées",
			html: mailBody,
		})

		const date = new Date();
		const timestamp = date.getTime();
		const filename = `./datas/new-apartments${timestamp}-${type}-${city}-budget_${budget.min}_${budget.max}-rooms_${rooms.min}_${rooms.max}-area_${area.min}_${area.max}.json`;
		fs.writeFileSync(filename, JSON.stringify(tab));
		
		await browser.close();

    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        await browser.close(); // Assure-toi de fermer le navigateur en cas d'erreur
        await reply.code(400).send({ error: "Une erreur interne s'est produite" }); // Envoie un message d'erreur approprié
    }
	// await browser.close();
});

async function scrapePage(page) {
	
	if (page !== null) {
		const apartmentData = await page.evaluate(() => {
			let apartmentElements = document.querySelectorAll('.sideListItemContainer');
			
			const apartmentData = [];
			if (apartmentElements.length === 0) {
				return apartmentData;
			}
			apartmentElements.forEach((apartmentElement) => {
				const title = apartmentElement.querySelector('.ad-overview-details__ad-title').innerText;
				const img = apartmentElement.querySelector('.img__image').src;
				const localisation = apartmentElement.querySelector('.ad-overview-details__address-title').innerText;
				const price = apartmentElement.querySelector('.ad-price').innerText;
				const link = apartmentElement.querySelector('.detailedSheetLink').href;
				const timestamp = Date.now();
				let type = '';
				if (title.toLowerCase().includes('appartement')) {
					type = 'appartement';
				} else if (title.toLowerCase().includes('maison')) {
					type = 'maison';
				} else {
					type = 'autre';
				}
				const source = 'bienici';
				apartmentData.push({ title, img, localisation, price, link, type, source, timestamp });
			});
			return apartmentData;
		});
		return apartmentData;
}
}

async function entryOnSite(url, captchaSelector, resultsSelector, page) {
	await page.goto(url);

	// await page.waitForSelector(captchaSelector);
	// await page.click(captchaSelector);

	await page.waitForSelector(resultsSelector || '.sideListNoResult');
}

try {
	await fastify.listen({ port: 3000 })
  } catch (err) {
	fastify.log.error(err)
	process.exit(1)
  }