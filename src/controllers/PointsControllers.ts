import {Request, Response} from 'express'
import knex from '../database/connection';

class PointsController {

    async index(req: Request, res: Response) {
        //  cidade, uf, items
        const { city, uf, items } = req.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.items_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

            const serializedPoints = points.map( point => {
                return {
                    ...point,
                    image_url: `http://192.168.1.108:3333/uploads/${point.image}` 
                }
            })

        return res.json(serializedPoints)

    }

    async create(req: Request, res: Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        } = req.body;
    
        const items = req.body.items;
    
        const trx = await knex.transaction();

        const points = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }
    
        const ids = await trx('points').insert(points);
    
        const pointsItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))  
            .map((items_id: number) => {

            return {
                items_id,
                point_id: ids[0]
            };
        } )
    
        await trx('points_items').insert(pointsItems);

        await trx.commit();
    
        return res.json({ 
            id: ids[0],
            ...points,
        });
    }

    async show(req: Request, res: Response){
        const { id } = req.params;

        const point = await knex('points').where( 'id', id).first();

        if(!point) return res.status(400).json({ message: 'Point not found.'});

        const serializedPoint = {   
            ...point,
            image_url: `http://192.168.1.108:3333/uploads/${point.image}` 
           
        }


        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.items_id')
            .where('points_items.point_id', '=', id)
            .select('items.title');

        return res.json({point: serializedPoint, items});
    }
};

export default PointsController;