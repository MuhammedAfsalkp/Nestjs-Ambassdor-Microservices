import {NestFactory} from "@nestjs/core";
import {AppModule} from "../app.module";
import { UserService } from "./usere.service";
import { createConnection } from "typeorm";
import { User } from "./user";


(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const userService = app.get(UserService);
    const connection = await createConnection({
        name: 'old',
        type: 'mysql',
        host: 'db',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'ambassodor',
        entities: [User],
      })

    const users = await connection.manager.find(User);


    for (let i = 0; i < users.length; i++) {
        await userService.save(users[i]);
    }

    process.exit();
})();
