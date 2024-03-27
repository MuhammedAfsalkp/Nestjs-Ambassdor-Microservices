import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user";
import { Repository } from "typeorm";
import { AbstractService } from "../shared/abstract.service";
import axios, { Method } from 'axios';
import { response } from 'express';
@Injectable()
export class UserService {
    baseURL = process.env.USERS_MS +'/api';  

    async request(method: Method, url: string, data = {}, cookie = '') {
        try {
            let headers = {}
            if (cookie != '') {
                headers = {
                    'Cookie': `jwt=${cookie}`
                }
            }
            const response = await axios.request({
                method,
                url,
                baseURL: this.baseURL,
                data,
                headers
            })
            return response.data;
        } catch (e) {
            return e.response.data;
        }
    }

    async post(url: string, data: any, cookie = ''){
        return this.request('post', url, data, cookie)
    }

    async get(url: string, cookie = ''){
        return this.request('get', url, {}, cookie)
    }

    async put(url: string, data: any, cookie = ''){
        return this.request('put', url, data, cookie)
    }
}
