//index.js
//var db = null;

var app_carp0052= {
    
loadRequirements: 0,
personId: null,
occID: null,
db: null,
    
init: function(){
    document.addEventListener("deviceready", app_carp0052.onDeviceReady);
    document.addEventListener("DOMContentLoaded", app_carp0052.onDomReady);
},
    
onDeviceReady: function(){
    app_carp0052.loadRequirements++;
    if(app_carp0052.loadRequirements === 2){
        app_carp0052.start();
    }
},
    
onDomReady: function(){
    app_carp0052.loadRequirements++;
    if(app_carp0052.loadRequirements === 2){
        app_carp0052.start();
    }
},
    
start: function(){
    console.info("connected");
    //connect to database
    app_carp0052.db = openDatabase('giftrDB', '', 'Giftr Database', 1024*1024);
    
    if (app_carp0052.db.version == "") {
        console.info('First time running database... Creating new tables.');
        
        app_carp0052.db.changeVersion("", "1.0",
                                      function (trans) {
                                      
                                      trans.executeSql("CREATE TABLE IF NOT EXISTS people(person_id INTEGER PRIMARY KEY AUTOINCREMENT, person_name TEXT)", [],
                                                       function (tx, rs) {
                                                       console.info("Table people created.");
                                                       },
                                                       function (tx, err) {
                                                       console.info(err.message);
                                                       });
                                      trans.executeSql("CREATE TABLE IF NOT EXISTS occasions(occ_id INTEGER PRIMARY KEY AUTOINCREMENT, occ_name TEXT)", [],
                                                       function (tx, rs) {
                                                       console.info("Table occasions created.");
                                                       },
                                                       function (tx, err) {
                                                       console.info(err.message);
                                                       });
                                      trans.executeSql("CREATE TABLE IF NOT EXISTS gifts(gift_id INTEGER PRIMARY KEY AUTOINCREMENT, person_id INTEGER, occ_id INTEGER, gift_idea TEXT, purchased BOOLEAN)", [],
                                                       function (tx, rs) {
                                                       console.info("Table gifts created.");
                                                       },
                                                       function (tx, err) {
                                                       console.info(err.message);
                                                       });
                                      },
                                      function (err) {
                                      console.info(err.message);
                                      },
                                      function () {
                                      app_carp0052.navHandlers();
                                      app_carp0052.updatePeople();
                                      app_carp0052.updateOccasions();
                                      });
    } else {
        console.log("Successfully connected to database!");
        app_carp0052.navHandlers();
        app_carp0052.updatePeople();
        app_carp0052.updateOccasions();

    }
},
    
navHandlers: function(){
    
    //swipe between pages
    var wrapper = document.querySelector(".wrapper");
    var swipe = new Hammer(wrapper);
    swipe.on('swipeleft', function (ev) {
             document.querySelector("#people-list").className = "hide";
             document.querySelector("#occasion-list").className = "show";
             });
    
    swipe.on('swiperight', function (ev) {
             document.querySelector("#people-list").className = "show";
             document.querySelector("#occasion-list").className = "hide";
             });
///////////////////////////////////////////////////////
    
    //add buttons
    var addPeople = document.querySelector("#people-list .btnAdd");
    var addOccasionBtn = document.querySelector("#occasion-list .btnAdd");
    var addPersonGiftBtn = document.querySelector("#gifts-for-person .btnAdd");
    var addOccasionGiftBtn = document.querySelector("#gifts-for-occasion .btnAdd");
    
    addPeople.addEventListener("click", function(){
                               document.querySelector("#add-person").style.display = "block";
                               document.querySelector("[data-role='overlay']").style.display="block";
                               app_carp0052.addPerson();
                               });
    
    addOccasionBtn.addEventListener("click", function(){
                               document.querySelector("#add-occasion").style.display="block";
                               document.querySelector("[data-role='overlay']").style.display="block";
                               app_carp0052.addOccasion();
                               });

    addPersonGiftBtn.addEventListener("click", function(){
                                      console.info("clicked add button");
                               document.querySelector("#add-gift-person").style.display="block";
                               document.querySelector("[data-role='overlay']").style.display="block";
                               app_carp0052.addPersonGift();
                               });

    addOccasionGiftBtn.addEventListener("click", function(){
                                        
                               document.querySelector("#add-gift-occasion").style.display="block";
                               document.querySelector("[data-role='overlay']").style.display="block";
                               app_carp0052.addOccasionGift();
                               });
///////////////////////////////////////////////////////
    
    //cancel buttons
    var cancelPeople = document.querySelector("#add-person .btnCancel");
    var cancelOccasionBtn = document.querySelector("#add-occasion .btnCancel");
    var cancelPersonGiftBtn = document.querySelector("#add-gift-person .btnCancel");
    var cancelOccasionGiftBtn = document.querySelector("#add-gift-occasion .btnCancel");
    
    cancelPeople.addEventListener("click", function(){
                               document.querySelector("#add-person").style.display = "none";
                               document.querySelector("[data-role='overlay']").style.display="none";
                               app_carp0052.addPerson();
                               });
    
    cancelOccasionBtn.addEventListener("click", function(){
                                    document.querySelector("#add-occasion").style.display="none";
                                    document.querySelector("[data-role='overlay']").style.display="none";
                                    app_carp0052.addOccasion();
                                    });
    
    cancelPersonGiftBtn.addEventListener("click", function(){
                                      document.querySelector("#add-gift-person").style.display="none";
                                      document.querySelector("[data-role='overlay']").style.display="none";
                                      app_carp0052.addPersonGift();
                                      });
    
    cancelOccasionGiftBtn.addEventListener("click", function(){
                                        document.querySelector("#add-gift-occasion").style.display="none";
                                        document.querySelector("[data-role='overlay']").style.display="none";
                                        app_carp0052.addOccasionGift();
                                        });
    ///////////////////////////////////////////////////////
    
    //back buttons
    var backToPeople = document.querySelector("#gifts-for-person .backBtn");
    var backToOccasions = document.querySelector("#gifts-for-occasion .backBtn");
    
    backToPeople.addEventListener("click", function(){
                                  document.querySelector("#people-list").className = "show";
                                  document.querySelector("#gifts-for-person").className = "hide";
                                  });
    
    backToOccasions.addEventListener("click", function(){
                                  document.querySelector("#occasion-list").className = "show";
                                  document.querySelector("#gifts-for-occasion").className = "hide";
                                  });
///////////////////////////////////////////////////////

},
    
addPerson: function(){
    var saveBtn = document.querySelector("#add-person .btnSave");
    
    saveBtn.addEventListener("click", function(ev){
                             ev.preventDefault();
                             var newPerson = document.querySelector("#new-person").value;
                             if(newPerson != ""){
                             
                                app_carp0052.db.transaction(function(trans){
                                                trans.executeSql('INSERT INTO people(person_name) VALUES(?)', [newPerson],
                                                                 function(tx, rs){
                                                                 //do something if it works, as desired
                                                                 console.info("Added " + newPerson + " to people list");
                                                                 app_carp0052.updatePeople();
                                                                 },
                                                                 function(tx, err){
                                                                 //failed to run query
                                                                 console.info( err.message);
                                                                 });
                                                },
                                                function(){
                                                //error for the transaction
                                                console.info("The insert sql transaction failed.")
                                                },
                                                function(){
                                                //success for the transaction
                                                //this function is optional
                                                });
                             }else{
                                console.info("Text field is empty");
                             }
    });
    
},
    
updatePeople: function(){
    document.querySelector("#add-person").style.display = "none";
    document.querySelector("[data-role='overlay']").style.display="none";
    
    var peopleList = document.querySelector("#people-list [data-role='listview']");
    
    app_carp0052.db.transaction(function(trans){
                                trans.executeSql('SELECT * FROM people', [],
                                                 function(tx, rs){
                                                 peopleList.innerHTML = "";
                                                 
                                                    for (var i = 0; i < rs.rows.length; i++) {
                                                        var li = document.createElement("li");
                                                 
                                                        li.innerHTML = rs.rows.item(i).person_name;
                                                        li.id = rs.rows.item(i).person_id;
                                                        peopleList.appendChild(li);
                                                    }
                                                 },
                                                 function(tx, err){
                                                 //failed to run query
                                                 console.info( err.message);
                                                 });
                                },
                                function(){
                                //error for the transaction
                                console.info("The select sql transaction failed.")
                                },
                                function(){
                                //success for the transaction
                                //this function is optional
                                });
    
    var clickPeopleList = new Hammer.Manager(peopleList);
    
    clickPeopleList.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
    clickPeopleList.add(new Hammer.Tap({ event: 'singletap' }) );
    clickPeopleList.get('doubletap').recognizeWith('singletap');
    clickPeopleList.get('singletap').requireFailure('doubletap');
    
    clickPeopleList.on("singletap", function (ev) {
                       console.info("singletap detected");
                       
                       document.querySelector("#people-list").className = "hide";
                       document.querySelector("#gifts-for-person").className = "show";
                       document.querySelector("#gifts-for-person h2").innerHTML = "Gifts for " + ev.target.innerHTML;
                       document.querySelector("#gifts-for-person span").innerHTML = ev.target.innerHTML;
                       personId = ev.target.id;
                       
                       app_carp0052.updateGiftsForPerson();
                  
                  });
    
    clickPeopleList.on("doubletap", function (ev) {
                       console.log("doubletap detected");
                  
                       app_carp0052.db.transaction(function(trans){
                                                   trans.executeSql('DELETE FROM people WHERE person_id = "' + ev.target.id + '"', [],
                                                                    function(tx, rs){
                                                                    //do something if it works, as desired
                                                                    console.info("Deleted " + ev.target.innerHTML + " from people list");
                                                                    app_carp0052.updatePeople();
                                                                    },
                                                                    function(tx, err){
                                                                    //failed to run query
                                                                    console.info( err.message);
                                                                    });
                                                   },
                                                   function(){
                                                   //error for the transaction
                                                   console.info("The delete sql transaction failed.")
                                                   },
                                                   function(){
                                                   //success for the transaction
                                                   //this function is optional
                                                   });

                  });

    

    
},
    
updateGiftsForPerson: function(){
    document.querySelector("#add-gift-person").style.display="none";
    document.querySelector("[data-role='overlay']").style.display="none";
    
    var personOccasionDropdownMenu = document.querySelector("#list-person");
    var personGiftList = document.querySelector("#gifts-for-person [data-role='listview']");
    
    app_carp0052.db.transaction(function(trans){
                                trans.executeSql('SELECT * FROM occasions', [],
                                                 function(tx, rs){
                                                 personOccasionDropdownMenu.innerHTML = "";
                                                 
                                                 for (var i = 0; i < rs.rows.length; i++) {
                                                 var option = document.createElement("option");
                                                 
                                                 option.innerHTML = rs.rows.item(i).occ_name;
                                                 option.value = rs.rows.item(i).occ_id;
                                                 personOccasionDropdownMenu.appendChild(option);
                                                 }
                                                 },
                                                 function(tx, err){
                                                 //failed to run query
                                                 console.info( err.message);
                                                 });
                                },
                                function(){
                                //error for the transaction
                                console.info("The select sql transaction failed.")
                                },
                                function(){
                                //success for the transaction
                                //this function is optional
                                });
    
    app_carp0052.db.transaction(function(trans){
                                trans.executeSql('SELECT g.gift_id, g.gift_idea, o.occ_name FROM gifts AS g INNER JOIN occasions AS o ON o.occ_id = g.occ_id WHERE g.person_id = ?', [personId],
                                                 function(tx, rs){
                                                 personGiftList.innerHTML = "";
                                                 
                                                 for (var i = 0; i < rs.rows.length; i++) {
                                                 var li = document.createElement("li");
                                                 
                                                 li.innerHTML = rs.rows.item(i).gift_idea + " - " + rs.rows.item(i).occ_name;
                                                 li.id = rs.rows.item(i).gift_id;
                                                 personGiftList.appendChild(li);
                                                 app_carp0052.updateGiftsForPerson();
                                                 }
                                                 },
                                                 function(tx, err){
                                                 //failed to run query
                                                 console.info( err.message);
                                                 });
                                },
                                function(){
                                //error for the transaction
                                console.info("The select sql transaction failed.")
                                },
                                function(){
                                //success for the transaction
                                //this function is optional
                                });

    
    var clickGiftForPersonList = new Hammer.Manager(personGiftList);
    
    clickGiftForPersonList.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
    clickGiftForPersonList.add(new Hammer.Tap({ event: 'singletap' }) );
    clickGiftForPersonList.get('doubletap').recognizeWith('singletap');
    clickGiftForPersonList.get('singletap').requireFailure('doubletap');
    
    clickGiftForPersonList.on("singletap", function (ev) {
                       console.info("singletap detected");
                       
//                              app_carp0052.db.transaction(function(trans){
//                                                          trans.executeSql('SELECT purchased FROM gifts', [],
//                                                                           function(tx, rs){
//                                                                           personGiftList.innerHTML = "";
//                                                                           
//                                                                           for (var i = 0; i < rs.rows.length; i++) {
//                                                                           var purchased = rs.rows.item(i).purchased;
//                                                                                if(purchased == false){
//                                                                                    ev.target.style.setProperty("text-decoration", "line-through");
//                                                                           app_carp0052.updateGiftsForPerson();
//                                                                                }
//                                                                           }
//                                                                           },
//                                                                           function(tx, err){
//                                                                           //failed to run query
//                                                                           console.info( err.message);
//                                                                           });
//                                                          },
//                                                          function(){
//                                                          //error for the transaction
//                                                          console.info("The select sql transaction failed.")
//                                                          },
//                                                          function(){
//                                                          //success for the transaction
//                                                          //this function is optional
//                                                          });
       
                       
                              
//                       document.querySelector("#people-list").className = "hide";
//                       document.querySelector("#gifts-for-person").className = "show";
//                       document.querySelector("#gifts-for-person h2").innerHTML = "Gifts for " + ev.target.innerHTML;
//                       document.querySelector("#gifts-for-person span").innerHTML = ev.target.innerHTML;
//                       personId = ev.target.id;
//                       
//                       app_carp0052.updateGiftsForPerson();
                       
                       });
    
    clickGiftForPersonList.on("doubletap", function (ev) {
                       console.log("doubletap detected");
                       
                       app_carp0052.db.transaction(function(trans){
                                                   trans.executeSql('DELETE FROM gifts WHERE gift_idea = "' + ev.target.id + '"', [],
                                                                    function(tx, rs){
                                                                    console.info("Deleted " + ev.target.innerHTML + " from gift list");
                                                                    app_carp0052.updateGiftsForPerson();
                                                                    },
                                                                    function(tx, err){
                                                                    //failed to run query
                                                                    console.info( err.message);
                                                                    });
                                                   },
                                                   function(){
                                                   //error for the transaction
                                                   console.info("The delete sql transaction failed.")
                                                   },
                                                   function(){
                                                   //success for the transaction
                                                   //this function is optional
                                                   });
                       
                       });

    

},
    
addPersonGift: function(){
    console.info("received click");
    var saveBtn = document.querySelector("#add-gift-person .btnSave");
    //var giftIdea = document.querySelector("#new-idea");
    var personGiftWindow = document.querySelector("#list-person");
    
    saveBtn.addEventListener("click", function(ev){
                             ev.preventDefault();
                             var giftIdea = document.querySelector("#add-gift-person #new-idea").value;
                             var occID = personGiftWindow.options[personGiftWindow.selectedIndex].value;
                             if(giftIdea != ""){
                             
                             app_carp0052.db.transaction(function(trans){
                                                         trans.executeSql('INSERT INTO gifts(person_id, occ_id, gift_idea, purchased ) VALUES(?, ?, ?, ?)', [personId, occID, giftIdea,false],
                                                                          function(tx, rs){
                                                                          //do something if it works, as desired
                                                                          console.info("Added " + giftIdea + " to gift list");
                                                                          app_carp0052.updateGiftsForPerson();
                                                                          },
                                                                          function(tx, err){
                                                                          //failed to run query
                                                                          console.info( err.message);
                                                                          });
                                                         },
                                                         function(){
                                                         //error for the transaction
                                                         console.info("The insert sql transaction failed.")
                                                         },
                                                         function(){
                                                         //success for the transaction
                                                         //this function is optional
                                                         });
                             }else{
                             console.info("Text field is empty");
                             }
                             });
    
},

    
addOccasion: function(){
    var saveBtn = document.querySelector("#add-occasion .btnSave");
    
    saveBtn.addEventListener("click", function(ev){
                             ev.preventDefault();
                             var newOccasion = document.querySelector("#new-occasion").value;
                             if(newOccasion != ""){
                             
                             app_carp0052.db.transaction(function(trans){
                                                         trans.executeSql('INSERT INTO occasions(occ_name) VALUES(?)', [newOccasion],
                                                                          function(tx, rs){
                                                                          //do something if it works, as desired
                                                                          console.info("Added " + newOccasion + " to occasion list");
                                                                          app_carp0052.updateOccasions();
                                                                          },
                                                                          function(tx, err){
                                                                          //failed to run query
                                                                          console.info( err.message);
                                                                          });
                                                         },
                                                         function(){
                                                         //error for the transaction
                                                         console.info("The insert sql transaction failed.")
                                                         },
                                                         function(){
                                                         //success for the transaction
                                                         //this function is optional
                                                         });
                             }else{
                             console.info("Text field is empty");
                             }
                             });

    
},
    
updateOccasions: function(){
    document.querySelector("#add-occasion").style.display = "none";
    document.querySelector("[data-role='overlay']").style.display="none";
    
    document.querySelector("#new-occasion").value = "";
    
    var occasionList = document.querySelector("#occasion-list [data-role='listview']");
    
    app_carp0052.db.transaction(function(trans){
                                trans.executeSql('SELECT * FROM occasions', [],
                                                 function(tx, rs){
                                                 occasionList.innerHTML = "";
                                                 
                                                 for (var i = 0; i < rs.rows.length; i++) {
                                                 var li = document.createElement("li");
                                                 
                                                 li.innerHTML = rs.rows.item(i).occ_name;
                                                 li.id = rs.rows.item(i).occ_id;
                                                 occasionList.appendChild(li);
                                                 }
                                                 },
                                                 function(tx, err){
                                                 //failed to run query
                                                 console.info( err.message);
                                                 });
                                },
                                function(){
                                //error for the transaction
                                console.info("The select sql transaction failed.")
                                },
                                function(){
                                //success for the transaction
                                //this function is optional
                                });
    
    var clickOccasionList = new Hammer.Manager(occasionList);
    
    clickOccasionList.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
    clickOccasionList.add(new Hammer.Tap({ event: 'singletap' }) );
    clickOccasionList.get('doubletap').recognizeWith('singletap');
    clickOccasionList.get('singletap').requireFailure('doubletap');
    
    clickOccasionList.on("singletap", function (ev) {
                       console.info("singletap detected");
                       
                       document.querySelector("#occasion-list").className = "hide";
                       document.querySelector("#gifts-for-occasion").className = "show";
                       document.querySelector("#gifts-for-occasion h2").innerHTML = "Gifts for " + ev.target.innerHTML;
                       document.querySelector("#gifts-for-occasion span").innerHTML = ev.target.innerHTML;
                       occID = ev.target.id;
                       
                       app_carp0052.updateGiftsForOccasion();
                       
                       });
    
    clickOccasionList.on("doubletap", function (ev) {
                       console.log("doubletap detected");
                       
                       app_carp0052.db.transaction(function(trans){
                                                   trans.executeSql('DELETE FROM occasions WHERE occ_id = "' + ev.target.id + '"', [],
                                                                    function(tx, rs){
                                                                    //do something if it works, as desired
                                                                    console.info("Deleted " + ev.target.innerHTML + " from occasions list");
                                                                    app_carp0052.updateOccasions();
                                                                    },
                                                                    function(tx, err){
                                                                    //failed to run query
                                                                    console.info( err.message);
                                                                    });
                                                   },
                                                   function(){
                                                   //error for the transaction
                                                   console.info("The insert sql transaction failed.")
                                                   },
                                                   function(){
                                                   //success for the transaction
                                                   //this function is optional
                                                   });
                       
                       });

},
    
updateGiftsForOccasion: function(){
    document.querySelector("#add-gift-occasion").style.display="none";
    document.querySelector("[data-role='overlay']").style.display="none";
    
    var occasionPersonDropdownMenu = document.querySelector("#list-occasion");
    var occasionGiftList = document.querySelector("#gifts-for-occasion [data-role='listview']");
    
    app_carp0052.db.transaction(function(trans){
                                trans.executeSql('SELECT * FROM people', [],
                                                 function(tx, rs){
                                                 occasionPersonDropdownMenu.innerHTML = "";
                                                 
                                                 for (var i = 0; i < rs.rows.length; i++) {
                                                 var option = document.createElement("option");
                                                 
                                                 option.innerHTML = rs.rows.item(i).person_name;
                                                 option.value = rs.rows.item(i).person_id;
                                                 occasionPersonDropdownMenu.appendChild(option);
                                                 }
                                                 },
                                                 function(tx, err){
                                                 //failed to run query
                                                 console.info( err.message);
                                                 });
                                },
                                function(){
                                //error for the transaction
                                console.info("The select sql transaction failed.")
                                },
                                function(){
                                //success for the transaction
                                //this function is optional
                                });
    
    app_carp0052.db.transaction(function(trans){
                                trans.executeSql('SELECT g.gift_id, g.gift_idea, p.person_name FROM gifts AS g INNER JOIN people AS p ON p.person_id = g.person_id WHERE g.occ_id = ?', [occID2],
                                                 function(tx, rs){
                                                 occasionGiftList.innerHTML = "";
                                                 
                                                 for (var i = 0; i < rs.rows.length; i++) {
                                                 var li = document.createElement("li");
                                                 
                                                 li.innerHTML = rs.rows.item(i).gift_idea + " - " + rs.rows.item(i).person_name;
                                                 li.id = rs.rows.item(i).gift_id;
                                                 occasionGiftList.appendChild(li);
                                                 app_carp0052.updateGiftsForPerson();
                                                 }
                                                 },
                                                 function(tx, err){
                                                 //failed to run query
                                                 console.info( err.message);
                                                 });
                                },
                                function(){
                                //error for the transaction
                                console.info("The select sql transaction failed.")
                                },
                                function(){
                                //success for the transaction
                                //this function is optional
                                });
    
    
    var clickGiftForOccasionList = new Hammer.Manager(occasionGiftList);
    
    clickGiftForOccasionList.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
    clickGiftForOccasionList.add(new Hammer.Tap({ event: 'singletap' }) );
    clickGiftForOccasionList.get('doubletap').recognizeWith('singletap');
    clickGiftForOccasionList.get('singletap').requireFailure('doubletap');
    
    clickGiftForOccasionList.on("singletap", function (ev) {
                              console.info("singletap detected");
                              
                              //                              app_carp0052.db.transaction(function(trans){
                              //                                                          trans.executeSql('SELECT purchased FROM gifts', [],
                              //                                                                           function(tx, rs){
                              //                                                                           personGiftList.innerHTML = "";
                              //
                              //                                                                           for (var i = 0; i < rs.rows.length; i++) {
                              //                                                                           var purchased = rs.rows.item(i).purchased;
                              //                                                                                if(purchased == false){
                              //                                                                                    ev.target.style.setProperty("text-decoration", "line-through");
                              //                                                                           app_carp0052.updateGiftsForPerson();
                              //                                                                                }
                              //                                                                           }
                              //                                                                           },
                              //                                                                           function(tx, err){
                              //                                                                           //failed to run query
                              //                                                                           console.info( err.message);
                              //                                                                           });
                              //                                                          },
                              //                                                          function(){
                              //                                                          //error for the transaction
                              //                                                          console.info("The select sql transaction failed.")
                              //                                                          },
                              //                                                          function(){
                              //                                                          //success for the transaction
                              //                                                          //this function is optional
                              //                                                          });
                              
                              
                              
                              //                       document.querySelector("#people-list").className = "hide";
                              //                       document.querySelector("#gifts-for-person").className = "show";
                              //                       document.querySelector("#gifts-for-person h2").innerHTML = "Gifts for " + ev.target.innerHTML;
                              //                       document.querySelector("#gifts-for-person span").innerHTML = ev.target.innerHTML;
                              //                       personId = ev.target.id;
                              //
                              //                       app_carp0052.updateGiftsForPerson();
                              
                              });
    
    clickGiftForOccasionList.on("doubletap", function (ev) {
                              console.log("doubletap detected");
                              
                              app_carp0052.db.transaction(function(trans){
                                                          trans.executeSql('DELETE FROM gifts WHERE gift_id = ?', [ev.target.id],
                                                                           function(tx, rs){
                                                                           console.info("Deleted " + ev.target.innerHTML + " from gift list");
                                                                           app_carp0052.updateGiftsForOccasion();
                                                                           },
                                                                           function(tx, err){
                                                                           //failed to run query
                                                                           console.info( err.message);
                                                                           });
                                                          },
                                                          function(){
                                                          //error for the transaction
                                                          console.info("The delete sql transaction failed.")
                                                          },
                                                          function(){
                                                          //success for the transaction
                                                          //this function is optional
                                                          });
                              
                              });

    
},
    
addOccasionGift: function(){
    console.info("received click");
    var saveBtn = document.querySelector("#add-gift-occasion .btnSave");
    var occasionsGiftWindow = document.querySelector("#list-occasion");
    
    saveBtn.addEventListener("click", function(ev){
                             ev.preventDefault();
                             var giftIdea = document.querySelector("#add-gift-occasion #new-idea").value;
                             var occID = occasionsGiftWindow.options[occasionsGiftWindow.selectedIndex].value;
                             var personId;
                             if(giftIdea != ""){
                             
                             app_carp0052.db.transaction(function(trans){
                                                         trans.executeSql('INSERT INTO gifts(person_id, occ_id, gift_idea, purchased ) VALUES(?, ?, ?, ?)', [personId, occID, giftIdea,false],
                                                                          function(tx, rs){
                                                                          //do something if it works, as desired
                                                                          console.info("Added " + giftIdea + " to gift list");
                                                                          app_carp0052.updateGiftsForOccasion();
                                                                          },
                                                                          function(tx, err){
                                                                          //failed to run query
                                                                          console.info( err.message);
                                                                          });
                                                         },
                                                         function(){
                                                         //error for the transaction
                                                         console.info("The insert sql transaction failed.")
                                                         },
                                                         function(){
                                                         //success for the transaction
                                                         //this function is optional
                                                         });
                             }else{
                             console.info("Text field is empty");
                             }
                             });

    
},
    
    
    
}//end of app_carp0052 object

app_carp0052.init();