import { Chart as ChartJS, ArcElement, Tooltip, Legend, plugins, Title } from 'chart.js';
import { Display } from 'react-bootstrap-icons';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function GraficoRespondidos({titulo, respondidos, noRespondidos} : {titulo: string, respondidos: number, noRespondidos:number}) {

const data = {
    labels: ['No respondieron', 'Respondieron'],
    datasets: [
        {
        label: 'Tasa de respuestas',
        data: [noRespondidos, respondidos],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
        },
    ],
    };

    return (
    <div className='w-75 align-text-center'>
        <p className='mb-0'>{titulo}</p>
        <Doughnut data={data} />
    </div>
    )
}