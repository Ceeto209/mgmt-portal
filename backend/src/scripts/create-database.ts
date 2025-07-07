import { AppDataSource } from '../config/data-source';

async function createDatabase() {
	try {
		await AppDataSource.initialize();
		console.log('Database connection established');
	} catch (error) {
		console.error('Error with database connection', error)
	} finally {
		await AppDataSource.destroy();
	}
}

createDatabase();
