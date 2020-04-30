import { mapData } from './map-data.js'
const data = mapData.features

const mapContainer = document.getElementById('map')

var x = 0
var y = 1
// console.log(data)
var geometryState = []

let max = 0

drawMap();

function getSelectedCases(id) {
  let kindeOfCase = document.getElementsByName("whatIsShown");

  if (kindeOfCase[0].checked) {
    return data[id].attributes.cases_per_100k
  } else if (kindeOfCase[1].checked) {
    return data[id].attributes.cases7_per_100k
  } else if (kindeOfCase[2].checked) {
    return attributes.cases
  }
}

function drawMap() {
  for (let id = 0; id < data.length; id++) {
    let output = ''

    let selectedCases = getSelectedCases(id);

    if (selectedCases > max) {
      max = selectedCases
    }

    data[id].geometry.rings.forEach(rings => {
      for (let i = 0; i < rings.length; i++) {
        const x = (minMax(rings[i][0], 'X')) * mapContainer.width.baseVal.value
        const y = (minMax(rings[i][1], 'Y')) * mapContainer.height.baseVal.value

        if (i === 0) {
          output += ` M ${x} ${y}`
        } else {
          output += ` L ${x} ${y}`
        }
      }
    })

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', output)
    let strokecolor = document.getElementById("colorOutline").value;
    path.setAttribute('stroke', strokecolor)
    console.log(strokecolor)

    let brightnesspercentage = getPercent(id);
    let color = document.getElementById("colorpicker").value;
    path.setAttribute('fill', `hsl(${color}, 100%, ${brightnesspercentage}%)`)
    path.setAttribute('id', id)


    path.setAttribute('data-tooltip', data[id].attributes.county)


    mapContainer.appendChild(path)
  };

  let oldID = 1
  document.getElementById('map').addEventListener('mouseover', function (e) {
    const modal = document.getElementById('countyInfos')
    modal.style.display = 'none'
    if (oldID !== e.target.id && e.target.id !== 'map') {
      oldID = e.target.id

      document.getElementById('nametooltip').style.visibility = 'visible'
      document.getElementById('nametooltip').innerHTML = data[e.target.id].attributes.county

      const span = document.getElementsByClassName('close')[0]
      span.onclick = function () {
        modal.style.display = 'none'
      }
    } else {
      document.getElementById('nametooltip').innerHTML = ''
      document.getElementById('nametooltip').style.visibility = 'hidden'
      oldID = 1
    }
  })

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
      drawMap();
    });
  });

  document.getElementById('colorpicker').addEventListener('change', function (e) {
    resetMap();
    drawMap();
  });

  document.getElementById('colorOutline').addEventListener('change', function (e) {
    resetMap();
    drawMap();
  })

  document.getElementById("state").dispatchEvent(new Event('change'));
}

function resetMap() {
  max = 0
  document.getElementById('map').innerHTML = '';
}

function displayModal(id, x, y) {
  if (id !== "map") {
    const modal = document.getElementById('countyInfos')
    const modalContent = document.getElementById('modalText')
    modalContent.innerHTML = ''

    const span = document.getElementsByClassName('close')[0]

    span.onclick = function () {
      modal.style.display = 'none'
    }

    const tag = document.createElement('p')

    const dataAtribute = data[+id].attributes

    modalCompet('Landkreis: ' + dataAtribute.county, modalContent)
    modalCompet('Bundesland: ' + dataAtribute.BL, modalContent)

    // Einwohnerzahl
    modalCompet('Einwohnerzahl: ' + dataAtribute.EWZ, modalContent)

    // Anzahl aller Infizierten
    modalCompet('Anzahl Infizierte: ' + dataAtribute.cases, modalContent)

    // pro100k
    modalCompet('Infizierte pro 100k: ' + dataAtribute.cases_per_100k, modalContent)

    // Pro100k 7 Tage
    modalCompet('Infizierte pro 100k in den letzten 7 Tagen: ' + dataAtribute.cases7_per_100k, modalContent)

    // Anzahl tote
    modalCompet('Anzahl Verstorbene: ' + dataAtribute.deaths, modalContent)

    //Set Modal To Mouse with Offset 
    //Offset makes Shure Modal is displayed in Map
    if (y < 520) {
      modal.style.top = (y) + 'px'
    } else {
      modal.style.top = (y) - 380 + 'px'
    }

    if (x < 520) {
      modal.style.left = (x) + 'px'
    } else {
      modal.style.left = (x - 200) + 'px'
    }
    modal.style.display = 'block' //Show Modal
  }
}

function modalCompet(text, div) {
  const tag = document.createElement('p')
  tag.appendChild(document.createTextNode(text))
  div.appendChild(tag)
}

function getPercent(id) {
  let kindeOfCase = document.getElementsByName("whatIsShown");

  if (kindeOfCase[0].checked) {
    return 100 - ((data[id].attributes.cases_per_100k / 1490) * 50);
  } else if (kindeOfCase[1].checked) {
    return 100 - ((data[id].attributes.cases7_per_100k / 124) * 50);
  } else if (kindeOfCase[2].checked) {
    return 100 - ((data[id].attributes.cases / 1490) * 50);
  }
}


function minMax(value, XY) {
  let min; let max = 0

  // The values for Germany
  if (XY === 'X') {
    min = 5.8
    max = 15.1
  } else if (XY === 'Y') {
    min = 47.2
    max = 55.1
  }

  return ((value - min) / (max - min))
}
