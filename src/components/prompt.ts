
export default (tone: string, temperature: number) => {
const header = "<p>As a specialized copywriter who crafts personalized marketing letters for property owners, your task is to rewrite the existing copy provided below into Danish while infusing a " + tone + " tone. </p>"
const propertyTypeText = '- {{propertyType}}: The type of property (e.g., "house," "apartment," etc.).<br/>'
const daysForSaleText = '- {{daysForSale}}: The number of days the property has been listed for sale.<br/>'
const cityText = '- {{city}}: The city in which the property owner resides.<br/>'
const userFullNameText = '- {{userFullName}}: Your username as the sender of the letter.<br/>'
const temperatureText = '<p>Please note that the "temperature" setting should be set to "'+ temperature +'".</p>'
const  avoid = '<p>Avoid including any additional notes about the rewritten text.</p>'
const incorporateVariablesText = "Incorporate the following variables:  <br/>"
const existingCopyHeader = 'Existing Copy (to be rewritten):<br/>'
const existingCopyBody = '<p>Kære Hanne <br/>' +
                        'Mit navn er Peter, og jeg er ejendomsmægler hos Resights. Jeg har bemærket, at din villa har været til salg i 87 dage, og at du allerede har lavet første prisjustering. Ofte er lange liggetider et tegn på, at mægleren har valgt en forkert strategi til at få ejendommen solgt, og jeg tror på, vi hos Resights kan gøre det bedre.<br>'+
                        'Hos Resights har vi god erfaring med salg af villaer i Roskilde, og vi har syv potentielle købere til villaer som din. Derfor vil jeg gerne tilbyde dig en uforpligtende, gratis vurdering og et møde, hvor jeg præsenterer dig for en ny salgsstrategi, som jeg mener, vil få din villa solgt! Jeg glæder mig til at høre fra dig.<br>'+
                        'Med venlig hilsen, Peter </p>'

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
