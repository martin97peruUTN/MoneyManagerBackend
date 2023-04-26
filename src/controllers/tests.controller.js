import { 
    indexService,  
    dbtestService 
} from '../services/tests.service.js';

export const index = (req, res) => {
    res.send(indexService())
}

export const dbtest = async (req, res) => {
    const result = await dbtestService()
	res.send(result)
}