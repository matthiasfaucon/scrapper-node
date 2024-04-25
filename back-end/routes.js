import puppeteer from 'puppeteer';
import fs from 'fs';
import { Resend } from 'resend';

// Get all the apartments from the files
export default function (fastify) {
   
    done()

}

// setInterval(checkNewApartments, 60 * 1000); // Vérifiez les nouvelles annonces toutes les 60 secondes

async function entryOnSite(url, captchaSelector, resultsSelector, page) {
	await page.goto(url);

	// await page.waitForSelector(captchaSelector);
	// await page.click(captchaSelector);

	await page.waitForSelector(resultsSelector || '.sideListNoResult');
}


        // page.waitForSelector('.mb-lg');
        // Inspectez la page pour trouver les sélecteurs CSS appropriés pour extraire les informations des annonces
        // const apartments = await page.evaluate(() => {
        //     const apartmentElements = document.querySelectorAll('.styles_adCard__JzKik ');
        //     const apartmentData = [];

        //     apartmentElements.forEach(apartmentElement => {
        //         // get by attribute
        //     const title = apartmentElement.querySelector('[data-qa-id]').innerText;
        //     console.log(title);
        //     const description = apartmentElement.querySelector('SELECTEUR_DE_LA_DESCRIPTION').innerText;
        //     const price = apartmentElement.querySelector('SELECTEUR_DU_PRIX').innerText;
        //     const link = apartmentElement.querySelector('SELECTEUR_DU_LIEN').href;

        //     apartmentData.push({ title, description, price, link });
        //     });

        //     return apartmentData;
        // });

        // console.log(apartments);

        // await page.goto('https://www.seloger.com/immobilier/locations/immo-nice-06/bien-appartement/?projects=1&types=1&places=[{%22inseeCodes%22:[60088]}]&mandatorycommodities=0&enterprise=0&qsVersion=1.0&m=search_refine-redirection-search_results');
        // await page.waitForNavigation();

        // const apartments2 = await page.evaluate(() => {

        //     const apartmentElements = document.querySelectorAll('.ListContent-sc-1viyr2k-0');
        //     const apartmentData = [];

        //     apartmentElements.forEach(apartmentElement => {
        //         const title = apartmentElement.querySelector('h2').innerText;
        //         console.log(title);
        //         // const description = apartmentElement.querySelector('SELECTEUR_DE_LA_DESCRIPTION').innerText;
        //         // const price = apartmentElement.querySelector('SELECTEUR_DU_PRIX').innerText;
        //         // const link = apartmentElement.querySelector('SELECTEUR_DU_LIEN').href;

        //         apartmentData.push({ title, description, price, link });
        //     });
        // });

        
        // await entryOnSite('https://www.logic-immo.com/location-immobilier-rouen-tous-codes-postaux,304_99/options/groupprptypesids=1,2,6,7,12', '#didomi-notice-agree-button', '.resultsListContainer', page);

        // const apartments3 = await page.evaluate(() => {

        //         let apartmentElements = document.querySelectorAll('.sideListItemContainer');

        //         const apartmentData = [];

        //         Array.from(apartmentElements).forEach(apartmentElement => {
        //             const title = apartmentElement.querySelector('h3').innerText;
        //             console.log(title);
        //             const price = apartmentElement.querySelector('.ad-price').innerText;
        //             // const price = apartmentElement.querySelector('SELECTEUR_DU_PRIX').innerText;
        //             const link = apartmentElement.querySelector('.detailedSheetLink').href;

        //             apartmentData.push({ title, price, link});
        //         });
        //         return apartmentData;
        //     });

        //     console.log(apartments3);

        // tab.push(...apartments3);

        // const currentApartments = await scrapeApartments(type, city, budget, rooms, area);