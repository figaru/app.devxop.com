import "./graph.devices.html";

import Highcharts from 'highcharts';

Template.graph_devices.onRendered(function () {

    let latestYear = Revenues.findOne({}, { sort: { year: -1 }, fields: { year: 1 } }).year;
    let oldestYear = Revenues.findOne({}, { sort: { year: 1 }, fields: { year: 1 } }).year;

    

    /* Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Revenue'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: [
                '00:00',
                '01:00',
                '02:00',
                '03:00',
                '04:00',
                '05:00',
                '06:00',
                '07:00',
                '08:00',
                '09:00',
                '10:00',
                '11:00',
                '12:00',
                '13:00',
                '14:00',
                '15:00',
                '16:00',
                '17:00',
                '18:00',
                '19:00',
                '20:00',
                '21:00',
                '22:00',
                '23:00'

            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Revenue (€)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} €</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: series,
        exporting: {
            enabled: false
        }
    }); */
});