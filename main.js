let ordersCS = JSON.parse(`[
    {
        "orderId": 244,
        "company": {
            "id": 1336,
            "name": "Erzbistum Bamberg",
            "locationId": 1860,
            "location": "Bamberg",
            "customerId": "K00047"
        },
        "items": [
            {
                "articleId": 795,
                "name": "PL-CS-SS-T1"
            },
            {
                "articleId": 796,
                "name": "PL-CS-SS-T1"
            },
            {
                "articleId": 797,
                "name": "PL-CS-SS-T1"
            },
            {
                "articleId": 794,
                "name": "PL-CS-SS-T1"
            }
        ]
    },
    {
        "orderId": 444,
        "company": {
            "id": 1337,
            "name": "Prolion RM Firm",
            "locationId": 1860,
            "location": "Bamberg",
            "customerId": "K00072"
        },
        "items": [
            {
                "articleId": 1111,
                "licenseKey": "K12345",
                "expirationDate": "2022-11-30T00:00:00.000Z",
                "name": "PL-CS-SS-1111"
            },
            {
                "articleId": 1112,
                "expirationDate": "2021-11-30T00:00:00.000Z",
                "name": "PL-CS-SS-1112"
            },
            {
                "articleId": 1113,
                "name": "PL-CS-SS-1113"
            },
            {
                "articleId": 1114,
                "name": "PL-CS-SS-1114"
            },
            {
                "articleId": 1122,
                "expirationDate": "2023-12-22T00:00:00.000Z",
                "licenseKey": "D07C2",
                "name": "PL-CS-SS-1121"
            },
            {
                "articleId": 1124,
                "expirationDate": "2024-11-30T00:00:00.000Z",
                "name": "PL-CS-SS-1124"
            },
            {
                "articleId": 1126,
                "licenseKey": "18DD9",
                "expirationDate": "2025-11-30T00:00:00.000Z",
                "name": "PL-CS-SS-1125"
            }
        ]
    }
]`);
let ordersRM = JSON.parse(`[
    {
        "orderId": 344,
        "company": {
            "id": 1337,
            "name": "Prolion RM Firm",
            "locationId": 1860,
            "location": "Bamberg",
            "customerId": "K00072"
        },
        "items": [
            {
                "articleId": 865,
                "name": "PL-RM-856"
            },
            {
                "articleId": 866,
                "name": "PL-RM-866"
            }
        ]
    }
]`);
let article147 = JSON.parse(`{
    "articleId": 147,
    "name": "PL-CS-T4",
    "product": "CS",
    "order": {
        "orderId": 72,
        "company": {
            "companyId": 50,
            "name": "Company A",
            "locationId": 2769,
            "location": "Vienna",
            "customerId": "K00245"
        }
    }
}`);
console.log(ordersCS);
console.log(ordersRM);

const express = require('express');
const app = express();
app.use(express.json()) // for parsing application/json

const port = 6969;
app.get('/orders-public', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.url);
    if (req.header('x-access-token') == 'a7f3b7fefb66386583bb751448a7cc9e8fcbe9a17416a7b16ddd138e3d57803f') {
        if (req.query.product == 'CS') {
            res.status(200).write(JSON.stringify(ordersCS));
        } else if (req.query.product == 'RM') {
            res.status(200).write(JSON.stringify(ordersRM));
        } else res.status(404).send('No order for product ' + req.query.product);
    } else res.status(401).send('No pulache has access this resource!');
    res.end();
});

app.get('/article/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.url);
    console.log(req.method);
    if (req.header('x-access-token') == 'a7f3b7fefb66386583bb751448a7cc9e8fcbe9a17416a7b16ddd138e3d57803f') {
        var id = req.params.id;
        console.log("GET Article id:" + id);
        // unused
        if (id == article147.articleId) {
            res.status(200).write(JSON.stringify(article147));
        }

    } else res.status(401).send('No pulache has access this resource!');
    res.end();
})

app.put('/article/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.url);
    if (req.header('x-access-token') == 'a7f3b7fefb66386583bb751448a7cc9e8fcbe9a17416a7b16ddd138e3d57803f') {
        var id = req.params.id;
        console.log("PUT Article id:" + id);
        console.log(req.body);
        // success
        console.log(req.params);
        console.log(req.query);
        console.log(req.headers);
        if(req.body.licenseKey===undefined) res.status(400).write('Need License key');

        ordersCS.forEach(order => {
            order.items.forEach(item => {
                if (item.articleId == id) {
                    item.licenseKey = req.body.licenseKey;
                    item.expirationDate = req.body.enddate;

                    console.log('Added to item');
                    console.log(item);
                    res.status(200).write('[1]');
                    console.log(ordersRM);
                }
            })
        });
        ordersRM.forEach(order => {
            order.items.forEach(item => {
                if (item.articleId == id) {
                    item.licenseKey = req.body.licenseKey;
                    item.expirationDate = req.body.enddate;

                    console.log('Added to item');
                    console.log(item);
                    res.status(200).write('[1]');
                    console.log(ordersRM);
                }
            })
        });

    } else res.status(401).send('No pulache has access this resource!');
    res.end();
})

app.listen(port, () => console.log(`Started listening on port ${port}`))