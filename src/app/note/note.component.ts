import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import fetch from 'node-fetch';


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})



export class NoteComponent implements OnInit {

  url= "https://wxnotes.herokuapp.com/"
   //url ="http://localhost:1000/"

  blink="none";
tanimate;

notelist=[];

timeout = null;

tex="wow";
message="test";

  ws = null;

  deleting =false;

  noclick= false;

  online= false;

  constructor() { 

this.connect().then(()=>{
  console.log("Connected " + new Date());
  this.online = true;
  
  setInterval(()=>{

    this.ws.send(JSON.stringify({ping:1}))

  },30000)


}).catch(()=>{
  console.log("Failed to Connect")
})


//load initial note data

fetch(this.url+"note")
.then((res)=>{return res.json()})
.then((data)=>{console.log(data.name)
this.tex=data.body;
this.message = this.tex; // get the text from serve and show
})


/////



  }

  ngOnInit() {






    this.ws.onmessage = function(event) {

      console.log(event.data);
      this.message=event.data;
      console.log(this.message)
     
    }.bind(this)


    this.ws.onclose = ()=>{
     this.online= false;
      console.log("Disconnected :("+ new Date())

    }


    this.getallnotelist() // calls the all list notes

  }


  // handles connection to WS;
connect(){
  return new Promise((res,reject)=>{
    
    this.ws = new WebSocket('wss://wxnotes.herokuapp.com');
    this.ws.onopen=()=>{res()}  
    this.ws.onerror = ()=>{
      reject()
    };
       
      //res();
    

  });
}

// async check(){
//   await this.connect();
//   if(this.ws!=null){
//     console.log("Connected to WS!!!" + this.ws);
//   }
//   else
//    console.log("not connected ");
// }

  wow(text: string){
    this.tex = text;
    
    
    clearTimeout(this.timeout);
    this.timeout = setTimeout(()=>{

     
      console.log(this.tex)

      let json = {
        note:this.tex
      }

    // this.ws.send(this.tex);
    
       this.ws.send(JSON.stringify(json), (err)=>{
        console.log("ERROR")
       })
  
   

    this.send({note:`${this.tex}`},this.url+"updatenote")
    }

   
    ,1000);

  }

  send(data,url){

    return new Promise((res,reject)=>{
    this.blink = "blink"
    this.tanimate="titleanimate"
    
    fetch(url, {
      method: "POST",
     
      headers: { "Content-Type": "application/json" },
      
      cache: "no-cache",
    body: JSON.stringify(data)

    }).then(res => {
      console.log(res)

    }).then(()=>{
      setTimeout(()=>{
        this.blink = "none"
        this.tanimate= ""
  },3000);

  res();
    }); 

    console.log(JSON.stringify(data));
    
  });

  }
  


  //save the note as list
save_note_log(){

this.noclick=true;  // prevent button to click while saving

  let time= new Date();
  this.send(
    {time:`${time}`,
    type:"savenote",
    note:`${this.tex}`}
    ,this.url+"savenote")
    
    .then((res)=>{
    console.log("done");
    }).then(()=>{
      setTimeout(() => {
        this.getallnotelist()
      }, 300);
      this.noclick=false;
      console.log("button re-enables again")
    })
   
}


getallnotelist(){

  return new Promise((res,req)=>{
  fetch(this.url+"notelist")
  .then((res)=>{return res.json()})
  .then((data)=>{console.log(data) // get the text from serve and show
    this.notelist = data.reverse();
  }).then(()=>{
    res();
  })
  })
}

deletenote(id){
  console.log(id)

this.deleting=true;

  fetch(this.url+"deletenote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
  body: JSON.stringify({id:`${id}`})

  }).then(res => {
    console.log(res.json())
   
  }).then(()=>{
    this.getallnotelist().then(()=>{
      this.deleting=false;
    })
  })

}



}
