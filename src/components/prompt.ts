
export default (tone: string, temperature: number) => {
const header = "<p>As a specialized copywriter who crafts personalized marketing " +
               " letters for property owners, your task is to rewrite the existing copy provided " +
               "  below into Danish while infusing a " + tone + " tone. </p>"

const incorporateVariablesText = "<p>Incorporate the following variables:</p>"
const cityText = "<li>{{city}}: The city in which the property owner resides.</li>"
const propertyTypeText = '<li>{{propertyType}}: The type of property (e.g., "house," "apartment," etc.).</li>'
const daysForSaleText = "<li>{{daysForSale}}: The number of days the property has been listed for sale.</li>"
const userFullNameText = "<li>{{userFullName}}: Your username as the sender of the letter.</li>"

const temperatureText = '<p>Please note that the "temperature" setting should be set to "'+ temperature +'".</p>'
const  avoid = "<p>Avoid including any additional notes about the rewritten text.</p>"
const existingCopyHeader = "<p>Existing Copy (to be rewritten):</p>"

const existingCopyBody = "<h3>Kære Hanne </h3><br>" +

                        "<p>Mit navn er Peter, og jeg er ejendomsmægler hos Resights. Jeg har bemærket, " +
                        "at din villa har været til salg i 87 dage, og at du allerede har lavet " +
                        "første prisjustering. Ofte er lange liggetider et tegn på, " +
                        "at mægleren har valgt en forkert strategi til at få ejendommen solgt, " +
                        "og jeg tror på, vi hos Resights kan gøre det bedre.</p><br>"+

                        "<p>Hos Resights har vi god erfaring med salg af villaer i Roskilde, og vi har " +
                        "syv potentielle købere til villaer som din. Derfor vil jeg gerne tilbyde " +
                        "dig en uforpligtende, gratis vurdering og et møde, hvor jeg " +
                        "præsenterer dig for en ny salgsstrategi, som jeg mener, vil få din villa " +
                        "solgt! Jeg glæder mig til at høre fra dig.</p><br>"+

                        "<p>Med venlig hilsen, Peter </p>"

return {
        header,
        propertyTypeText,
        daysForSaleText,
        cityText,
        userFullNameText,
        temperatureText,
        avoid,
        incorporateVariablesText,
        existingCopyHeader,
        existingCopyBody
    }
}
