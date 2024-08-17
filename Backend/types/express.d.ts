import { User } from '@prisma/client'; // Adjust the import based on your actual User model import path

declare global {
    namespace Express {
        interface Request {
            user?: User; // Add the user property to the Request interface
        }
    }
}
