document.getElementById("submit").addEventListener("click", function(event) {
  event.preventDefault();
  let baseURI = event.currentTarget.baseURI;
  let searchBy = "";
  /*const value = document.getElementById("weatherInput").value;
  if (value === "") {
    return;
  }*/

  //console.log(value);
  //currentTarget.baseURI
  if (baseURI.includes("house.html")) {
    searchBy = "house";
    getWizardsBy(searchBy);
  }
  else if (baseURI.includes("spellbook.html")) {
    getSpells();
  }
  else {
    searchBy = "group";
    getWizardsBy(searchBy);
  }

});

function getWizardsBy(searchType) {
  let slctr = document.getElementById("selector");
  let selection = slctr.options[slctr.selectedIndex];
  let category = selection.value;
  let categoryText = selection.text;

  let returnAll = (category == "All");

  var potterAPIKEY = "$2a$10$sl0znT5TeL3KPemt3x2.KuUIBiBrRjGFND5MuTCzYP2GrtPQQs1z6";

  const url = "https://www.potterapi.com/v1" + "/characters" + "?key=" + potterAPIKEY;  //+ value + ",US&units=imperial" + "&APPID=" + weatherAPIKEY;
  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log(json);

      let results = json;

      let peopleOfHouse = "<h2>" + categoryText + '</h2><div class="people">';
      //let houses = []

      if (searchType == "house") {
        for (let person of results) {
          //houses.push(person.house);

          if (replaceUndefined(person.house) == category || returnAll) {
            peopleOfHouse += organizeInformation(person);
          }
        }
      }
      else if (searchType == "group") {
        for (let person of results) {
          let groups = [];

          person.dumbledoresArmy ? groups.push("DA") : "";
          person.ministryOfMagic ? groups.push("MoM") : "";
          person.deathEater ? groups.push("DE") : "";
          person.orderOfThePhoenix ? groups.push("OotP") : "";

          groups.length == 0 ? groups.push("None") : "";

          if (!returnAll) {
            for (let group of groups) {
              if (replaceUndefined(group) == category) {
                peopleOfHouse += organizeInformation(person);
              }
            }
          }
          else {
            peopleOfHouse += organizeInformation(person);
          }
        }
      }

      peopleOfHouse += "</div>"

      document.getElementById("wizard-results").innerHTML = peopleOfHouse;
    });
}

function getSpells() {
  let slctr = document.getElementById("selector");
  let selection = slctr.options[slctr.selectedIndex];
  let category = selection.value;
  let categoryText = selection.text;

  let returnAll = (category == "All");

  var potterAPIKEY = "$2a$10$sl0znT5TeL3KPemt3x2.KuUIBiBrRjGFND5MuTCzYP2GrtPQQs1z6";

  const url = "https://www.potterapi.com/v1" + "/spells" + "?key=" + potterAPIKEY;  //+ value + ",US&units=imperial" + "&APPID=" + weatherAPIKEY;
  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log(json);

      let results = json;

      let spells = "<h2>" + categoryText + '</h2><div class="spells">';

      for (let spell of results) {
        if (category.includes(replaceUndefined(spell.type)) || returnAll) {
          spells += organizeSpellInfo(spell);
        }
      }
      spells += "</div>"

      document.getElementById("spell-results").innerHTML = spells;
    });
}

function replaceUndefined(text) {
  return text == undefined ? "Unknown" : text;
}


function organizeInformation(person) {
  let organizedPerson = '<div class="people-card">';

  organizedPerson += '<div class="info-name">' +  toTitleCase(replaceUndefined(person.name)) + "</div>";
  organizedPerson += '<div class="info"><strong>House:</strong> ' + toTitleCase(replaceUndefined(person.house)) + "<br>";
  organizedPerson += "<strong>Patronus:</strong> " + toTitleCase(replaceUndefined(person.patronus)) + "<br>";
  organizedPerson += "<strong>Blood Line:</strong> " + toTitleCase(replaceUndefined(person.bloodStatus)) + "<br>";
  organizedPerson += "<strong>Groups:</strong><br>";

  let groups = person.deathEater ? "Death Eaters<br>" : "";
  groups += person.dumbledoresArmy ? "Dumbledore's Army<br>" : "";
  groups += person.ministryOfMagic ? "Ministry of Magic<br>" : "";
  groups += person.orderOfThePhoenix ? "Order of the Phoenix<br>" : "";
  organizedPerson += (groups == "") ? "None" : groups;

  organizedPerson += "</div></div>";

  return organizedPerson;
}

function organizeSpellInfo(spell) {
  let organizedSpell = '<div class="spell-card">';

  organizedSpell += '<div class="info-name">' +  toTitleCase(replaceUndefined(spell.spell)) + "</div>";
  organizedSpell += '<div class="info"><strong>Effect:</strong> ' + toTitleCase(replaceUndefined(spell.effect)) + "<br>";
  organizedSpell += "<strong>Type:</strong> " + toTitleCase(replaceUndefined(spell.type)) + "<br><br>";

  organizedSpell += "</div></div>";

  return organizedSpell;
}


function findDateIndex(fiveDayList, dateToFind) {
  for (let day = 0; day < fiveDayList.length; day++) {
    if (fiveDayList[day].date == dateToFind) {
      return day;
    }
  }

  return -1;
}

function toTitleCase(text) {
  let newText = "";
  let newChar = "";
  let uppercaseLetter = true;

  for (let character of text) {
    if (character == " ") {
      newChar = character;
      uppercaseLetter = true;
    }
    else if (uppercaseLetter) {
      newChar = character.toUpperCase();
      uppercaseLetter = false;
    }
    else {
      newChar = character;
    }

    newText += newChar;

  }

  return newText
}
