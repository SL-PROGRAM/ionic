import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import {Question} from '../models/question';
import {OpenTriviaService} from '../providers/openTriviaService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public difficult = 'Easy';
  public saveInformation = true;
  public pseudo = 'zeaazzeez';
  public error = '';
  public login = false;
  public repondu = false;
  public questions: Question[] = [];
  public questionNumber = 0;
  public questionCourant : Question;
  public questionPrint = "";
  public allReponse =[];
  public reponseJuste = 0;
  public endQuestion = false;
  public token = '';


  constructor(private alertCtrl: AlertController,
              private toastController: ToastController,
              private rechercherQuestion: OpenTriviaService,

    ){ }

    public initGame(){
      this.difficult = 'Easy';
      this.saveInformation = true;
      this.pseudo = 'zeaazzeez';
      this.error = '';
      this.login = false;
      this.repondu = false;
      this.questions = [];
      this.questionNumber = 0;
      this.questionPrint = "";
      this.allReponse =[];
      this.reponseJuste = 0;
      this.endQuestion = false;
    }

  public async clickStartButton(){
    this.error = '';
    if (!this.saveInformation){
      this.pseudo = '';
      this.difficult = '';
    }

    if (!this.pseudo || this.pseudo.length < 3 ){
      const alert  = await this.alertCtrl.create({
                header : 'Information manquante',
                message : 'Veuillez saisir un titre de 3 caractères'
            });
      alert.present();
      return;
    }
    if (!this.difficult || this.difficult === undefined){
      const alert  = await this.alertCtrl.create({
        header : 'Information manquante',
        message : 'choisissez une difficulté'
        });
      alert.present();
      return;
    }
    this.login = true;

    this.presentToast();
    await this.rechercherQuestion.getQuestions(100, 'easy')
        .then((resultat) => {
              this.questions = resultat;
              this.selectQuestion();
            }
        )
        .catch(async (err) => {
          const alert = await this.alertCtrl.create({
            header : 'Erreur appel Service',
            message : 'Impossible de recupérer les question',
            buttons: ['OK']
          });
          alert.present();
        });
  }

  private selectQuestion() {
    this.questionCourant = this.questions[this.questionNumber];
    this.questionNumber++;
    this.makePrint()
  }

  private makePrint(){
    this.questionPrint = this.questionCourant.question;
    this.allReponse = [];
    this.allReponse = this.allReponse.concat(this.questionCourant.incorrect_answers);
    this.allReponse.splice(this.numberRandom(this.allReponse.length), null, this.questionCourant.correct_answer);
    let rr = this.allReponse.length
    let mark = 0;
  }


  private numberRandom (number : number) : number{
    return Math.round(Math.random()*number);
  }

  public voirBonneReponse(){
    this.endQuestion = true;
  }

  async restart(){
    this.initGame();
  }


  public testReponse(reponse){
      this.repondu = true;
      if(reponse == this.questionCourant.correct_answer){
        this.reponseJuste++;
      }
  }

  public questionSuivante(){
      this.selectQuestion();
      this.repondu = false;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }
}
