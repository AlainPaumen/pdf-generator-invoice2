const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

async function createPDF(data, templateFile){

	var templateHtml = fs.readFileSync(path.join(process.cwd(), templateFile), 'utf8');
	var template = handlebars.compile(templateHtml);
	var html = template(data);
	
	//console.log(html);

	var pdfPath = path.join('pdf', `${data.name}-${data.invoiceNb}.pdf`);
	// During testing 
	//var milis = new Date();
	//milis = milis.getTime();
	//var pdfPath = path.join('pdf', `${data.name}-${data.invoiceNb}-${milis}.pdf`);

	var options = {
		width: '1230px',
		headerTemplate: "<p></p>",
		footerTemplate: "<p></p>",
		displayHeaderFooter: false,
		margin: {
			top: "10px",
			bottom: "30px"
		},
		printBackground: true,
		path: pdfPath,
		format: 'A4'
	}

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: true,
	});

	var page = await browser.newPage();
	
	await page.goto(`data:text/html;charset=UTF-8,${html}`, {
		waitUntil: 'networkidle0'
	});

	await page.pdf(options);
	await browser.close();
}

const dataInvoice = {
	name: "Invoice# Hoogin",
	invoiceNb: "2022-003",
	created: "04-april-2022",
	due: "14-april-2022",
	customer: {
		name: "Centomedia NV",
		street: "Industrieweg 83",
		city: "Paal - Beringen",
		zipcode: "3583",
		vat: "BE 0451.885.386"
	},
	lines: [
		{
			description: "Management Services Maart (23d)",
			amount: "11.000,00 €",
		},
		{
			description: "Consultancy (2h)",
			amount: "1.250,00 €",
		}
		],
	totals: {
		subtotal: "12.250,00 €",
		vatAmount: "2.572,50 €",
		total: "14.822,50 €"
	}
}
createPDF(dataInvoice, 'invoice.html');
