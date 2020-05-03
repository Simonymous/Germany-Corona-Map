import { mapData } from './map-data.js'
import { displayModal, resetMap, displayTooltip } from './mapController.js'
const data = mapData.features

export default function init() {
    //Event Listener Für Mouse Hover
    document.getElementById('map').addEventListener('mouseover', function (e) {
        const modal = document.getElementById('countyInfos')
        modal.style.display = 'none'
        if (e.target.id !== 'map') {

            //document.getElementById('nametooltip').innerHTML = data[e.target.id].attributes.county
            displayTooltip(e.target.id, e.clientX, e.clientY)

            const span = document.getElementsByClassName('close')[0]
            span.onclick = function () {
                modal.style.display = 'none'
            }
        } else {
            document.getElementById('nametooltip').innerHTML = ''
            document.getElementById('nametooltip').style.visibility = 'hidden'
        }
    })

    //Event Listener for LK Click
    document.getElementById('map').addEventListener('click', function (e) {
        const id = e.target.id
        displayModal(id, e.clientX, e.clientY)
        document.getElementById("state").value = data[+id].attributes.BL;
        document.getElementById("state").dispatchEvent(new Event('change'));
    })

    let caseSelection = document.getElementsByName('whatIsShown');
    caseSelection.forEach(caseSelector => {
        caseSelector.addEventListener('change', function (e) {
            resetMap();
        });
    });

    document.getElementById('colorpicker').addEventListener('change', function (e) {
        resetMap();

    });

    document.getElementById('colorOutline').addEventListener('change', function (e) {
        resetMap();
    })

    document.getElementById("state").dispatchEvent(new Event('change'));
}
