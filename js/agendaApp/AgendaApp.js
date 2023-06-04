class AgendaApp {
    api; // in het geheugen wordt een api gemaakt
    switcher; // in het geheugen wordt een switcher gemaakt
    month = 0; // in het geheugen wordt een month is 0 gemaakt
    constructor() { // constructor gaat lopen
        this.api = new API(); // Haalt de API op
        this.switcher = new Switcher(this); //maakt een switcher aan en geven ons zelf aan mee
        this.api.getData().then(result => {
            this.switcher.loadAgenda(result[this.month]); //roept de switcher en loadagenda aan met de maand
        });
    }
    switchMonths = (sign) => { // Functie om de maand te wijzigen op basis van een vooraf bepaald teken.
        switch (sign) {
            case "+": // Als het teken "+" is, verhoog de waarde van month met 1
                this.month = this.month + 1;
                break;
            case "-":  // Als het teken "-" is, verlaag de waarde van month met 1
                this.month = this.month - 1;
                break;
        }
        if (this.month === 12) {  // Als 'month' gelijk is aan 12, stel het in op 0 (januari)
            this.month = 0;
        }
        if (this.month === -1) { // Als 'month' gelijk is aan -1, stel het in op 11 (december)
            this.month = 11;
        } // Laad de agenda voor de bijgewerkte maand met behulp van de switcher en de bijbehorende gegevens uit de api voor die maand
        this.switcher.loadAgenda(this.api.data[this.month]);
    }
}

class API {
    data = []; // in het geheugen wordt een data met een lege array gemaakt

    async getData() { // in de achtergrond de data uit ophalen
        await fetch("../data/data.json").then(response => {
                return response.json(); // pak de echte data uit
            }).then(data => {
                this.data = data.months; // de data uit json zet in de data met alleen de maanden 
            });
        return this.data; // geeft data terug
    }
}

class Agenda {
    renderer; // in het geheugen wordt een renderer gemaakt
    header; // in het geheugen wordt een header gemaakt
    month; // in het geheugen wordt een month gemaakt
    htmlElement; // in het geheugen wordt een htmlElement gemaakt
    agendaApp; // in het geheugen wordt een agendaApp gemaakt

    constructor(data, agendaApp) { // constructor gaat lopen en geeft data en agendaApp mee
        this.agendaApp = agendaApp; // slaat de agendaApp op
        this.htmlElement = document.createElement("article"); //Maakt een nieuwe article
        this.htmlElement.classList.add("agenda"); // voegt een nieuwe agenda classe toe
        this.data = data; // de data zet hij hier in
        this.renderer = new Renderer(); // Maakt een nieuwe renderer
        this.renderer.render("body", this.htmlElement); // hier rendert hij de body in de article
        this.header = new Header(this, data.name, this.agendaApp); //hier maakt hij een nieuwe header aan
        this.month = new Month(this, data.days);//hier maakt hij een nieuwe maand aan
    }

    render(placeToRender, WhatToRender) { // rendert
        this.renderer.render(placeToRender, WhatToRender); // gaat naar de renderer
    }
}



class Header {
    nameOfMonth; // in het geheugen wordt een nameOfMonth gemaakt
    htmlElement; // in het geheugen wordt een htmlElement gemaakt
    agenda; // in het geheugen wordt een agenda gemaakt
    leftButton; // in het geheugen wordt een leftButton gemaakt
    rightButton; // in het geheugen wordt een rightButton gemaakt
    constructor(agenda, nameOfMonth, agendaApp) {  // constructor gaat lopen en geeft agenda, nameOfMonth en agendaApp mee
        this.agenda = agenda; // slaat de agenda op
        this.agendaApp = agendaApp; // slaat de agendaApp op
        this.nameOfMonth = nameOfMonth; // slaat de nameOfMonth op
        this.htmlElement = document.createElement("header"); // Maakt een nieuwe header
        this.htmlElement.classList.add("agenda__header"); // voegt een classe toe
        this.text = document.createElement("h2"); // maakt een nieuwe h2
        this.agenda.render(".agenda", this.htmlElement); // gaat renderen
        
        this.leftButton = new Button("previous", "<", "agenda--left", this, agendaApp); // Maakt een nieuwe linker button
        this.agenda.render(".agenda__header", this.text); // Maakt een nieuwe linker button
        this.rightButton = new Button("next", ">", "agenda--right", this, agendaApp); // Maakt een nieuwe rechter button
        this.text.innerText = this.nameOfMonth; // Geeft de maand aan de tekst
    }
    render(placeToRender, whatToRender) { // rendert
        this.agenda.render(placeToRender, whatToRender); // rendert naar de header
    }
}
class Button {
    htmlElement; // in het geheugen wordt een htmlElement gemaakt
    innerText; // in het geheugen wordt een innerText gemaakt
    extraClass; // in het geheugen wordt een extraClass gemaakt
    switcher; // in het geheugen wordt een switcher gemaakt
    header; // in het geheugen wordt een header gemaakt
    type; // in het geheugen wordt een type gemaakt
    constructor(type, innerText, extraClass, header, agendaApp) { // constructor gaat lopen en geeft type, innerText, extraClass, header en agendaApp mee
        this.type = type; // slaat de type op
        this.agendaApp = agendaApp; // slaat de agendaApp op
        this.htmlElement = document.createElement("button"); // Maakt een nieuwe button
        this.htmlElement.classList.add("agenda__button"); // Geeft een classe mee met agenda_button
        this.extraClass = extraClass; // slaat de extraClass op
        this.htmlElement.classList.add(this.extraClass); // 
        this.innerText = innerText; // slaat de innerText op
        this.htmlElement.innerText = this.innerText; // slaat de inerText  in het htmlelement op
        //this.switcher = new Switcher(this.extraClass);
        this.header = header; // slaat de header op
        this.render() // rendert zichzelf
        // Wijs de functie buttonClicked toe als eventhandler voor het click evenement van htmlElement
        this.htmlElement.onclick = this.buttonClicked;  

    }
    buttonClicked = () => {     // Eventhandlerfunctie die wordt aangeroepen wanneer de knop wordt geklikt
        if (this.type === "previous") {  // Als het type van de knop "previous" is, roep de 'switchMonths' functie aan met het teken '-' om naar de vorige maand te schakelen
            this.agendaApp.switchMonths("-");
            return;
        }
        this.agendaApp.switchMonths("+");  // Als het type van de knop niet "previous" is, roep de 'switchMonths' functie aan met het teken '+' om naar de volgende maand te schakelen
    }
    render() {     // Render de header met behulp van de 'render' functie van het 'header' object, en geef het htmlElement door
        this.header.render("header", this.htmlElement); 
    }
}

class Switcher {
    agendaApp; // in het geheugen wordt een agendaApp gemaakt
    agenda; // in het geheugen wordt een agenda gemaakt
    cleaner; // in het geheugen wordt een cleaner gemaakt
    constructor(agendaApp) { // krijgt de AgendaApp mee
        this.agendaApp = agendaApp // slaat de agendaApp op
        this.cleaner = new Cleaner(); // Maakt een nieuwe cleaner
    }
    loadAgenda = (data) => {
        this.cleaner.clean("body"); // De cleaner cleant de body
        this.agenda = new Agenda(data, this.agendaApp); // Maakt een nieuwe agenda met de data
    }
}

class Month {
    days = []; // in het geheugen wordt een days met een lege array gemaakt
    agenda; // in het geheugen wordt een agenda gemaakt
    numberOfDays; // in het geheugen wordt een numberOfDays gemaakt
    htmlElement; // in het geheugen wordt een htmlElement gemaakt
    constructor(agenda, numberOfDays) { // de constructor gaat lopen en geeft een agenda en nummersOfDays mee
        this.htmlElement = document.createElement("ul"); // ul wordt hier gemaakt
        this.htmlElement.classList.add("agenda__month"); // geeft de classe mee agenda__month
        this.numberOfDays = numberOfDays; // slaat de numberOfDays op
        this.agenda = agenda; //slaat de agenda op
        this.agenda.render(".agenda", this.htmlElement); // In de agenda rendert hij de maand
        for (let i = 1; i <= numberOfDays; i++) { // maakt een aantal van de dagen die hij bengen krijgt 
            this.days.push(new Day(this, i)); // maakt een nieuwe dag
        }
    }
    renderDays(placeToRender, WhatToRender) { // rendert de maand in de agenda
        this.agenda.render(placeToRender, WhatToRender) // gaat renderen
    }
}

class Day {
    month; // in het geheugen wordt een month gemaakt
    htmlElement; // in het geheugen wordt een htmlElement gemaakt
    dayNumber; // in het geheugen wordt een dayNumber gemaakt

    constructor(month, dayNumber) { // de constructor gaat lopen en geeft een month en dayNumber mee
        this.dayNumber = dayNumber; // slaat de dayNumber op
        this.htmlElement = document.createElement("li"); // maakt een li
        this.htmlElement.classList.add("agenda__day"); // geeft een classe agenda_day
        this.htmlElement.innerText = this.dayNumber; // Geeft de dag mee aan de tekst
        this.month = month; // slaat een month op
        this.month.renderDays(".agenda__month", this.htmlElement); //rendert in de maand
    }
}