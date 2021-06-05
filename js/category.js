var db_cat

//데베 만들기
function openDB_category(){
    db_cat = window.openDatabase('category','1.0','카테고리',1024*1024*5);
    console.log('DB 생성');
}


  //카테고리 테이블 만들기
  // function createTableCat() 
  // {
  //   db_cat.transaction(function(tr){
  //     var createSQL = 'create table if not exists category(name text, color color)';      
  //     tr.executeSql(createSQL, [], function(){
  //       console.log('카테고리 테이블 생성 sql 실행 성공');
  //     },function(){
  //       console.log('카테고리 테이블 생성 sql 실행 실패');
  //     },function(){
  //       console.log('카테고리 테이블 생성 트랜잭션 실패 , 롤백 자동');
  //     },function(){
  //       console.log('카테고리 테이블 생성 트랜잭션 성공');
  //     }
  //   );          
  // });
  // }



  //카테고리 추가
  function addCategory() {
    db.transaction(function(tr){
      var insertSQL = 'insert into category(name,color) values(?,?)';
      var name = $('#catName').val();
      var color = $('#catColor').val();
      
      tr.executeSql(insertSQL,[name,color],function(tr,rs){
        //createCatIcon();
      },
      
        function(tr,err){
        console.log('DB오류'+err.message+err.code);
      })
    });
  }



//카테고리를 자동 입출금의 카테고리 선택 (<select>에다 넣기)에다 추가
function createCatList(){
    db.transaction(function(tr){
    var selectSQL='select * from category';
    //select의 id로 불러옴
    var targetSel=document.getElementById('select2');
    tr.executeSql(selectSQL,[],function(tr,rs){
      //테이블 정보 하나씩 불러오기
      for(var i=0;i<rs.rows.length;i++)
      {
        //테이블의 name항목 저장
        var catSelect= rs.rows.item(i).name;
        var opt=document.createElement('option');
        //value와 내용을 name(데베의 카테고리이름)으로 정해줌
        opt.setAttribute('value',catSelect);
        opt.innerText=catSelect;
        //child로 넣기
        targetSel.appendChild(opt);
      }
    });
  });
}




//카테고리 데베에서 가져와 원형 아이콘 만들기
function createCatIcon(){
    db.transaction(function(tr){
    var selectSQL='select * from category';
    tr.executeSql(selectSQL,[],function(tr,rs){
      //dot-wrap : 동그라미들을 예쁘게 나열하려고 설정 동그라미들을 감싸주는 역할
      $('<div class="dot-wrap" id="dot-wrap">').appendTo('#catIcons');
        var target=document.getElementById('#dot-wrap');
        $(target).css({
          "width":"360px",
          "margin":0});

      //정보 하나씩 불러옴
      for(var i=0;i<rs.rows.length;i++)
      {
        var catName=rs.rows.item(i).name;
        var catColor=rs.rows.item(i).color;
        //span 하나씩 추가
        $('<span style="border:3px solid black; background-color:'+catColor+' "><p style="font-size:13px; margin-top:-15px;">'+catName+'</p></span>').appendTo('#catIcons');
        var target2=document.getElementsByTagName('span');
        //현재 span의 css스타일 설정해줌
        $(target2).css({        
          "width":"60px",
          "height":"60px",
          "margin-right":"3px",
          "margin-left":"3px",
          "align-items": "center",
          "border-radius":"50%",
          "font-weight":"bold",
          "text-align":"center",
          "line-height":"200px",
          "float":"left",
          "margin-top": "50px",
          "margin-left":"20px",
          "margin-right":"20px",
          "margin-bottom":"30px"});
        }
        //catIcons라는 카테고리 페이지의 content부분에 넣음
        $('</div>').appendTo('#catIcons');
    });
  });
}

// Main 화면용 카테고리 가져오는 메서드
function createCatIcon_main(){
    db.transaction(function(tr){
    var selectSQL='select * from category';
    tr.executeSql(selectSQL,[],function(tr,rs){
      //dot-wrap : 동그라미들을 예쁘게 나열하려고 설정 동그라미들을 감싸주는 역할
      $('<div class="dot-wrap" id="dot-wrap">').appendTo('#catIcons');
        var target=document.getElementById('#dot-wrap');
        $(target).css({
          "width":"360px",
          "margin":0});
      
      //정보 하나씩 불러옴
      for(var i=0;i<rs.rows.length;i++)
      {
        console.log(rs.rows.item(i));
        var catName=rs.rows.item(i).name;
        var catColor=rs.rows.item(i).color;
        //span 하나씩 추가
        $('<span id ="' + catName + '" class = "cat" style="border:3px solid black; background-color:'+catColor+' "><p style="font-size:13px; margin-top:-15px;">'+catName+'</p></span>').appendTo('#catIcons');
        var target2=document.getElementsByTagName('span');
        //현재 span의 css스타일 설정해줌
        $(target2).css({        
          "width":"50px",
          "height":"50px",
          "margin-right":"3px",
          "margin-left":"3px",
          "align-items": "center",
          "border-radius":"50%",
          "font-weight":"bold",
          "text-align":"center",
          "line-height":"150px",
          "float":"left",
          "margin-top": "10px",
          "margin-left":"5px",
          "margin-right":"5px",
          "margin-bottom":"10px"});
        }
        //catIcons라는 카테고리 페이지의 content부분에 넣음
        $('</div>').appendTo('#catIcons');
    });
  });
}

