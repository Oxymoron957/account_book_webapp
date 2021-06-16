//자동 입출금 테이블 만들기
function createTableAuto() {
  db.transaction(function(tr){
  var createSQL = 'create table if not exists auto(id integer primary key autoincrement , name text, type text, category text, day integer, amount integer, updatemonth integer)';      
  tr.executeSql(createSQL, [], function(){
    console.log('자동입출금 테이블 생성 sql 실행 성공');
  },function(){
    // console.log(err.message);
    console.log('자동입출금 테이블 생성 sql 실행 실패');
  });
  }, function(){
    console.log('자동입출금 테이블 생성 트랜잭션 실패 , 롤백 자동');
  }, function(){
    console.log('자동입출금 테이블 생성 트랜잭션 성공');



  }); 
}




//예산 관리 함수
function Budget(){
  db.transaction(function(tr){
    var count=0;
    var selectSQL='select * from auto';
    
    tr.executeSql(selectSQL,[],function(tr,rs){
      for(var i=0;i<rs.rows.length;i++)
      {
        if(rs.rows.item(i).name=='이번 달 예산')
          count=count+1;
      }
      updateBudget(count);
      saveBudget(count);
    });
  });
}


  //예산 최초저장
  function saveBudget(count){
    db.transaction(function(tr){
      var newName = '이번 달 예산';
      var newCategory = '예산';
      var newFlag="처리 전";
      var newDay=1;
      var amount=$('#budgetInput').val();
      var month = new Date().getMonth()+1;
      if((count==0)&&(amount!=''))
      {
        var insertSQL = 'insert into auto(name,type,category,day,amount,updatemonth) values(?,?,?,?,?,?)';
        tr.executeSql(insertSQL,[newName,newFlag,newCategory,newDay,amount,month],function(tr,rs){
        console.log('예산 최초저장 완료');
        });
      }
  });
}


//예산 갱신
  function updateBudget(count){
      db.transaction(function(tr){
      var catBud = "예산";
      var moneyBud=$('#budgetInput').val();
      var T = "처리 전";
      var updateSQL = 'update Auto set amount=? ,type =? where category=?';
      if((count!=0)&&(moneyBud!=''))
      {
        tr.executeSql(updateSQL,[moneyBud,T,catBud],function(tr,rs){
          console.log('예산 업데이트 완료');
        },function(tr,err){
          console.log('DB오류'+err.message+err.code);
       }
      );
      }

      deletePayment_Category('예산');
    });  
  }






  //자동 입출금 테이블에 항목 추가
  function addAutoMoney(){
    db.transaction(function(tr){
      var target=document.getElementById("select");
      var target2=document.getElementById("select2");

      var name=$('#nameAuto').val();
      var type="처리 전";
      var category=target2.options[target2.selectedIndex].text;
      console.log("type"+type+"  category"+category+name);
      var day=$('#dateAuto').val();
      var amount=$('#inputAuto').val();
      var updateMonth = new Date().getMonth()+1;
      if((name=='')||(category=='선택')||(day=='')||(amount==''))
      {
        alert("입력하지 않은 정보가 있습니다!");
      }
      else{
        if(target.options[target.selectedIndex].text=="출금")
        {
          amount=amount*(-1);
        }
        var insertSQL = 'insert into auto(name,type,category,day,amount,updatemonth) values(?,?,?,?,?,?)';
        console.log("insert?");
        tr.executeSql(insertSQL,[name,type,category,day,amount,updateMonth], function(tr,rs){
        console.log('no: ' + rs.insertId);
        document.location.href='#auto';
        $('#nameAuto').val('');
        $('#dateAuto').val('');
        $('#inputAuto').val('');
        }, function(tr,err){
          console.log('DB오류'+err.message+err.code);
        }
        );
      }
    });
  }




  //자동 입출금 목록 테이블에서 가져오기
  function createAutoList(){
    db.transaction(function(tr){
      $('#autoShowList').empty();
      var selectSQL='select * from auto';
      tr.executeSql(selectSQL,[],function(tr,rs){
        for(var i=0;i<rs.rows.length;i++)
        {
          var autoName= rs.rows.item(i).name;
          
          var autoCat=rs.rows.item(i).category;
          var autoDay=rs.rows.item(i).day;
          var autoAmount=rs.rows.item(i).amount;
          
          var autoId=rs.rows.item(i).id;
          var autotype;
          if(autoAmount<0)
          {
            autotype="출금💸";

          }
          else{
            autotype="입금😻";
          }
          //#autoShowList라는 곳에 넣어줌. 
          $('<li style="border:3px solid black; background-color:white;border-radius:12px; padding:7px; padding-bottom:3px; margin-bottom:20px;"><p style="font-size:16px;"><a href id = "autoDel" style="float: right; height: 10px; text-decoration:none;" value = "'
          +autoId+'">X</a>'
            +autoName+' <b>'+autoDay+'</b>일 마다<br/><p style="font-size:22px;"><b>'
              +Math.abs(autoAmount)+'원</b> '+autotype+'</p><p style="margin-top:px;font-size:14px;text-align:right; color:#949494;">'
                +autoCat+'</p></li>').appendTo('#autoShowList');
        }
      });
    });
  }

  //자동 입출금 내역 삭제
  function deleteAuto(id){
    db.transaction(function(tr){
        console.log("id : "+id);
        var deleteSQL = 'delete from auto where id = ?';
        tr.executeSql(deleteSQL, [id], function(tr,rs){
            console.log('auto 삭제');
        }, function(tr,err){
            console.log('DB 오류'+err.message+err.code);
        });

    });
}


// 카테고리 삭제할때 쓰이는 삭제한 해당 카테고리에 대한 모든 내용 auto테이블에서 삭제
function deleteAuto_Category(category){
  db.transaction(function(tr){
      
      var deleteSQL = 'delete from auto where category = ?';
      tr.executeSql(deleteSQL, [category], function(tr,rs){
          console.log('auto 삭제');
      }, function(tr,err){
          console.log('DB 오류'+err.message+err.code);
      });

  });
}



  //자동입출금 payment에 날짜에 따라 반영하기 -- 수정
  function insertAutoToDB(){
    var changeName;
      

    db.transaction(function(tr){
      var today=new Date();
      var day=today.getDate();
      var month=today.getMonth()+1;
      var year=today.getFullYear();

      const id = [];
      const name = [];
      const category = [];
      const amount = [];
      const autoDay = [];

      console.log(day);
      
      selectSQL='select * from auto';
      var test='no';
      // 처리해야할 날짜가 됐는데 처리 전인 튜플을 찾는 함수


      function findAutoToChange(callback){
        tr.executeSql(selectSQL, [], function(tr,rs){

        
          for(var i=0;i<rs.rows.length;i++)
        {
          if((day>=rs.rows.item(i).day)&&(rs.rows.item(i).type==='처리 전'))
          {
            test='yes';
            console.log(rs.rows.item(i).id);
            id[i] = rs.rows.item(i).id;
            name[i] = rs.rows.item(i).name;
            category[i] = rs.rows.item(i).category;
            amount[i] = rs.rows.item(i).amount;
            autoDay[i] = rs.rows.item(i).day;
            // var insertSQL = 'insert into payment(name,category,year,month,day,amount) values(?,?,?,?,?,?)';
            // tr.executeSql(insertSQL,[name,category,year,month,day,amount], function(tr,rs){
              
            // console.log('no: ' + rs.insertId);
            // }, function(tr,err){
            //   console.log('DB오류'+err.message+err.code);
            // }
            // );
            
          }
        }
        callback(id,name,category,amount,autoDay);
      });
      }

      // A()함수에서 찾은 튜플들을 처리 전--->> 처리 후로 변경하고 paymentDB에 넣는 함수 ########## latitude, longitude
      function insertToPayment(id,name,category,amount,autoDay){
        console.log(test);
        console.log(id);
        var updateSQL = 'update auto set type=?,updatemonth=? where id = ?';
        for(var i=0;i<id.length;i++){
          if(id[i] != undefined){
            tr.executeSql(updateSQL,["처리 후",month,id[i]],function(tr,rs){
            console.log("auto 초기화 완료");
            });
          }
        }

        var insertSQL = 'insert into payment(name,category,year,month,day,amount) values(?,?,?,?,?,?)';
        for(var i=0;i<id.length;i++){
          if(id[i]!=undefined){
            tr.executeSql(insertSQL,[name[i],category[i],year,month,autoDay[i],amount[i]], function(tr,rs){
            console.log('no: ' + rs.insertId);
            }, function(tr,err){
              console.log('DB오류'+err.message+err.code);
            }
            );
          }
        }
        
      }
      findAutoToChange(insertToPayment);
      //name text, category text, year integer, month integer, day integer, amount integer
    });
  }
  
  // 다음달이 되면 처리후 --> 처리전 되돌리기 
  function updateAuto(){
    const id = [];

    db.transaction(function(tr){
      var today=new Date();
      var day=today.getDate();
      var month=today.getMonth()+1;
      var year=today.getFullYear();

      console.log(day);
      
      selectSQL='select * from auto';

      function findAutoToChange2(callback){
        tr.executeSql(selectSQL, [], function(tr,rs){
          test='yes';
          for(var i=0;i<rs.rows.length;i++)
          {
            if((month!=rs.rows.item(i).updatemonth)&&(rs.rows.item(i).type==='처리 후'))
            {
              id[i] = rs.rows.item(i).id;
            }
          }
          callback();
        });
        }

        function updateType(){
          var updateSQL = 'update auto set type=? where id = ?';
          for(var i=0;i<id.length;i++){
            tr.executeSql(updateSQL,["처리 전",id[i]],function(tr,rs){
            // console.log("auto 초기화 완료");
            });
          }
        }
        findAutoToChange2(updateType);
        //name text, category text, year integer, month integer, day integer, amount integer
      });
    }

