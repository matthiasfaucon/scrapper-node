<template>
    <div :class="css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '90vh',
    })">
        <div :class="css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '75%',
        })">
            <h1 :class="css({
                color: '#051014',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
            })">Tableau de bord</h1>
            <canvas id="apartments-chart"></canvas>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { css } from "../../styled-system/css";

const apartmentsData = ref([]);

onMounted(async () => {
    let response = await fetch('http://localhost:3000/api/apartments');
    response = await response.json();
    apartmentsData.value = response;

    renderChart();
});

function renderChart() {
    const ctx = document.getElementById('apartments-chart').getContext('2d');
    // transform date 2024-04-07 en 07/04/2024 pour l'affichage

    const data = {
        labels: Object.keys(apartmentsData.value),
        datasets: [{
            label: 'Nombre de résulats trouvés',
            data: Object.values(apartmentsData.value).map((apartment) => apartment.length),
            backgroundColor: '#051014',
            borderColor: '#051014',
            borderWidth: 1,
        }]
    };
    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
    new Chart(ctx, {
        type: 'line',
        data,
        options
    });
}
</script>