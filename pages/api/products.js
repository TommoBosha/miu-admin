import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(res, req);

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }));
        } else {
            res.json(await Product.find())
        };
    }

    if (method === 'POST') {
        const { title, description, price, images, category, properties, productIndex, tag } = req.body;
        const productDoc = await Product.create({
            title, description, price, images, category, properties, productIndex, tag
        })
        res.json(productDoc);
    }

    if (method === 'PUT') {
        const { title, description, price, images, category, properties, productIndex, tag, _id } = req.body;
        await Product.updateOne({ _id }, { title, description, price, images, category, properties, productIndex, tag });
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query?.id });
            res.json(true);
        }
    }

}