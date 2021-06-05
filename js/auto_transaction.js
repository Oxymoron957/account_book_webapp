var db_auto

//데베 만들기
function openDB_auto_transaction(){
    db_auto = window.openDatabase('Auto_Transaction','1.0','자동입출금',1024*1024*5);
    console.log('DB 생성');
}


//자동 입출금 테이블 만들기 -- 수정(김혜준)
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


  //예산 최초저장 -- 수정
  function saveBudget(){
    db.transaction(function(tr){
      var newName = '이번 달 예산';
      var newCategory = '예산';
      var newFlag="완료";
      var newDay=1;
      var amount=0;
      var month = new Date().getMonth()+1;
      var insertSQL = 'insert into auto(name,type,category,day,amount,updatemonth) values(?,?,?,?,?,?)';
      tr.executeSql(insertSQL,[newName,newFlag,newCategory,newDay,amount,month],function(tr,rs){
      console.log('예산 업댓');
  });
});
}// 수정 후에 ajax로 ? refresh로 ? 페이지 수정하기






  //예산 관리 페이지에서 예산 저장 버튼 누르면 발동. 자동으로 예산 업데이트(자동입출금 테이블에서 확인 가능)
  function updateBudget(){
      db.transaction(function(tr){
      var catBud = "예산";
      var moneyBud=$('#budgetInput').val();
      var updateSQL = 'update Auto set amount=? where category=?';
      tr.executeSql(updateSQL,[moneyBud,catBud],function(tr,rs){
          console.log('예산 업데이트 완료');
        },function(tr,err){
          console.log('DB오류'+err.message+err.code);
       }
      );
    });  
  }






  //자동입출금 관리 페이지에서 추가항목 저장 버튼 누르면 발동. 자동 입출금 테이블에 항목 추가 -- 수정
  function addAutoMoney(){
    db.transaction(function(tr){
      console.log("실행돼");
      var target=document.getElementById("select");
      var target2=document.getElementById("select2");

      var name=$('#nameAuto').val();
      var type="처리 전";
      var category=target2.options[target2.selectedIndex].text;
      console.log("type"+type+"  category"+category+name);
      var day=$('#dateAuto').val();
      var amount=$('#inputAuto').val();
      var updateMonth = new Date().getMonth()+1;
      if(target.options[target.selectedIndex].text=="출금")
      {
        
        amount=amount*(-1);
      }
      var insertSQL = 'insert into auto(name,type,category,day,amount,updatemonth) values(?,?,?,?,?,?)';
      console.log("insert?");
      tr.executeSql(insertSQL,[name,type,category,day,amount,updateMonth], function(tr,rs){
      console.log('no: ' + rs.insertId);
      }, function(tr,err){
        console.log('DB오류'+err.message+err.code);
      }
      );
    });
  }




  //자동 입출금 목록 테이블에서 가져오기
  function createAutoList(){
    db.transaction(function(tr){
      var selectSQL='select * from auto';
      tr.executeSql(selectSQL,[],function(tr,rs){
        for(var i=0;i<rs.rows.length;i++)
        {
          var autoName= rs.rows.item(i).name;
          
          var autoCat=rs.rows.item(i).category;
          var autoDay=rs.rows.item(i).day;
          var autoAmount=rs.rows.item(i).amount;
          var autotype;
          if(autoAmount<0)
          {
            autotype="출금";
          }
          else{
            autotype="입금";
          }
          //#autoShowList라는 곳에 이 html 요소를 넣어줌. 그럼 for문 하나씩 돌 때 마다 하나씩 추가되겟죠??
          $('<li style="border:1px solid black; margin-bottom:20px;"><p style="font-size:20px;">'
            +autoName+' '+autoDay+'일 마다<br/><p style="font-size:30px;">'
              +autoAmount*(-1)+'원 '+autotype+'</p><br/>카테고리 : '
                +autoCat+'<br/></li>').appendTo('#autoShowList');
        }
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
      function A(callback){
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

      function B(id,name,category,amount,autoDay){
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
      A(B);
      //name text, category text, year integer, month integer, day integer, amount integer
    });
  }
  
  // 다음달이 되면 처리후 --> 처리전 되돌리기 --수정
  function updateAuto(){
    const id = [];

    db.transaction(function(tr){
      var today=new Date();
      var day=today.getDate();
      var month=today.getMonth()+1;
      var year=today.getFullYear();

      console.log(day);
      
      selectSQL='select * from auto';

      function A(callback){
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

        function B(){
          var updateSQL = 'update auto set type=? where id = ?';
          for(var i=0;i<id.length;i++){
            tr.executeSql(updateSQL,["처리 전",id[i]],function(tr,rs){
            // console.log("auto 초기화 완료");
            });
          }
        }
        A(B);
        //name text, category text, year integer, month integer, day integer, amount integer
      });
    }





  function insert2Pay(name,category,year,month,day,amount){
    db.transaction(function(tr){
      var insertSQL = 'insert into payment(name,category,year,month,day,amount) values(?,?,?,?,?,?)';
      tr.executeSql(insertSQL,[name,category,year,month,day,amount], function(tr,rs){
        console.log('no: ' + rs.insertId);
      }, function(tr,err){
        console.log('DB오류'+err.message+err.code);
      }
      );
    });
  }

  function modifyAuto(i){
    db.transaction(function(tr){
      var change='완료';
      var updateSQL = 'update payment set type=? where rowid=?';
      tr.executeSql(updateSQL,[change,i],function(tr,rs){
        console.log(i+" : 완료로 처리");
      });
    });
  }