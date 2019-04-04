import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})



export class NoteComponent implements OnInit {

  blink="none";
tanimate;

notelist=[];

timeout = null;

tex="wow";
message="test";

  ws = null;

  deleting =false;

  constructor() { 

this.connect().then(()=>{
  console.log("Connected");
}).catch(()=>{
  console.log("Failed to Connect")
})


//load initial note data

fetch("http://localhost:1000/note")
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

    this.getallnotelist() // calls the all list notes

  }


  // handles connection to WS;
connect(){
  return new Promise((res,reject)=>{
    
    this.ws = new WebSocket('ws://localhost:1000');
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
    this.ws.send(this.tex);

    this.send({note:`${this.tex}`},"http://localhost:1000/updatenote")
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
    }); 

    console.log(JSON.stringify(data));
    res();
  });

  }
  


  //save the note as list
save_note_log(){

  let time= new Date();
  this.send(
    {time:`${time}`,
    type:"savenote",
    note:`${this.tex}`}
    ,"http://localhost:1000/savenote")
    
    .then((res)=>{
    console.log("done");
    }).then(()=>{
      this.getallnotelist()
    })
   
}


getallnotelist(){

  return new Promise((res,req)=>{
  fetch("http://localhost:1000/notelist")
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

  fetch("http://localhost:1000/deletenote", {
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
