import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
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

    const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom' as const,
                    onClick: () => {},
                    align: 'center' as const,
                    labels: {
                        padding: 15,
                        boxWidth: 15,
                        boxHeight: 15,
                        textAlign: 'left' as const
                    }
                }
            }
        }

    return (
    <div className='w-75 align-text-center'>
        <h5 >{titulo}</h5>
        <br />
        <Doughnut data={data} options={options}/>
    </div>
    )
}
