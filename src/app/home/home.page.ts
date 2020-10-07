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


  constructor(private alertCtrl: AlertController,
              private toastController: ToastController,
              private rechercherQuestion: OpenTriviaService,

    ){ }

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
    await this.rechercherQuestion.getQuestions(1, 'easy')
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
     await this.makePrint();
  }

  private selectQuestion() {

    // this.questionNumber = this.questions.length;
    // let mark = this.numberRandom(this.questions.length);
    // this.questionCourant = this.questions[mark];
    // console.log(this.questions);
    // this.questions.splice(mark, 1);
    // console.log(this.questions);
  }

  private makePrint(){
    this.questionPrint = this.questionCourant.question;
    this.allReponse = this.questionCourant.incorrect_answers;
    this.allReponse.splice(this.numberRandom(this.allReponse.length), null, this.questionCourant.correct_answer);
    let rr = this.allReponse.length
    let mark = 0;
  }


  private numberRandom (number : number) : number{
    return Math.round(Math.random()*number);
  }


  public testReponse(reponse){

      this.repondu = true;
      console.log(reponse);
  }

  public questionSuivante(){
      this.selectQuestion();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }
}
