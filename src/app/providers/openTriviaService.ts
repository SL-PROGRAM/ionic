import {Injectable} from '@angular/core';
import {Question} from '../models/question';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable(
    {
        providedIn : 'root'
    }
)
export class OpenTriviaService{
    constructor(private httpClient: HttpClient) {    }

    async getQuestions(number: number, difficult: string): Promise<Array<Question>> {
         let token =  await this.getToken();
        return new Promise((resolve, reject) =>
        {
            let params = new HttpParams();
            params = params.append('token', token);
            if(number){
                params = params.append('amount', String(number) );
            }
            if (difficult && difficult !== ''){
                params = params.append('difficulty', difficult);
            }
            console.log('coco');
            this.httpClient.get('https://opentdb.com/api.php', { params: params })
                .toPromise()
                .then((response) =>{
                    console.log(response);
                    if(response['response_code'] == 0 ){
                        resolve(response['results'])
                        console.log(response['results']);
                    }
                    else {
                        reject('Le serveur n\'a pas retourné de valeur !!!' );
                    }
                })
                .catch((error) =>{
                    reject(error);
                })

        })
    }

    public getToken(): Promise<string> {
        return new Promise((resolve, reject) =>
        {
            let params = new HttpParams();

            this.httpClient.get('https://opentdb.com/api_token.php?command=request', { params: params })
                .toPromise()
                .then((response) =>{
                    console.log(response);
                    if(response['response_code'] == 0 ){
                        resolve(response['token'])
                        console.log(response['token']);
                    }
                    else {
                        reject('Le serveur n\'a pas retourné de valeur !!!' );
                    }
                })
                .catch((error) =>{
                    reject(error);
                })

        })
    }
}

