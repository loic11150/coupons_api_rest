const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
app.get('/', (req, res) => {
    res.send("It's work");
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
const { MongoClient } = require("mongodb");
async function asyncCall () { 
    
    //to connect mongo serv : colection and bdd name = coupons
    const db = (await MongoClient.connect("mongodb://localhost:27017/coupons")).db();
    const coupons = db.collection("coupons");//bd+collection

    //add coupon ressource : JSON
    app.post('/coupons', async  (req, res) => {
        id = parseInt(req.body._id);
        let idPromise = isExist(id);
        idPromise.then(async function(result) {
            if (result){
                res.status(400).json("erreur l'id existe déjà");
            }else{
                await coupons.insertOne(req.body);
                res.status(201).json(req.body);
            }
        })
    })

    //find 1 coupon
    app.get('/coupons/:id', async  (req, res) => {
        id = parseInt(req.params.id);
        let idPromise = isExist(id);
        idPromise.then(async function(result) {
            if (result){
                coupon = await coupons.findOne({"_id":id});
                res.status(200).json(coupon);
            }else{
                res.status(404).json("erreur l'id n'existe pas");
            }
        })
    })

    //find all coupons
    app.get('/coupons', async  (req, res) => {
        coupon = await coupons.find({}).toArray();
        res.status(200).json(coupon);
    })

    //delete coupon
    app.delete('/coupons/:id', async (req, res) =>{
        id = parseInt(req.params.id);
        let idPromise = isExist(id);
        idPromise.then(async function(result) {
            if (result){
                await coupons.deleteOne({"_id":id});
                res.status(201).json();
            }else{
                res.status(400).json("erreur l'id n'existe pas");
            }
        })
    })

    //function to test if id exist
    async function isExist(id){
        id = parseInt(id);
        const res = await coupons.findOne({"_id":id});
        if (res === null) {
            return false;}
        else{
            return true;
        }   
    }
}
asyncCall();

