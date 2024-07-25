import Services from '../models/Services.js';
import { validateObjectId, handleNotFoundError } from '../utils/index.js';

const createService = async (req, res) => {
    if (Object.values(req.body).includes('')) {
        const error = new Error('Por favor, llena todos los campos.');

        return res.status(400).json({
            msg: error.message
        })
    }

    try {
        const service = new Services(req.body);
        const result = await service.save();

        res.json({
            msg: 'Servicio creado correctamente.',
            result
        })
    } catch (error) {
        console.log(error);
    }
}

const getServices = async (req, res) => {
    try {
        const services = await Services.find();
        res.json(services);
    } catch (error) {
        console.log(error);
    }
}

const getServiceById = async (req, res) => {
    const { id } = req.params;

    // Validar un object id
    if (validateObjectId(id, res)) return;

    // Validar si el servicio existe
    const service = await Services.findById(id);

    if (!service) {
        return handleNotFoundError('Servicio no encontrado.', res);
    }

    // Mostar el servicio
    res.json(service);
}

const updateService = async (req, res) => {
    const { id } = req.params;

    // Validar un object id
    if (validateObjectId(id, res)) return;

    // Validar si el servicio existe
    const service = await Services.findById(id);

    if (!service) {
        return handleNotFoundError('Servicio no encontrado.', res);
    }

    // Actualizar el servicio
    service.name = req.body.name || service.name;
    service.price = req.body.price || service.price;

    try {
        await service.save();
        res.json({
            msg: 'Servicio actualizado correctamente.',
            service
        })
    } catch (error) {
        console.log(error);
    }
}

const deleteService = async (req, res) => {
    const { id } = req.params;

    // Validar un object id
    if (validateObjectId(id, res)) return;

    // Validar si el servicio existe
    const service = await Services.findById(id);

    if (!service) {
        return handleNotFoundError('Servicio no encontrado.', res);
    }

    // Eliminar el servicio
    try {
        await service.deleteOne();
        res.json({
            msg: 'Servicio eliminado correctamente.',
            service
        })
    } catch (error) {
        console.log(error);
    }
}

export {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
}