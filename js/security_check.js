//암호 설정칸
var code2="0000";
var code;
var isPassword = false
//암호 체크
function check_Pass() {
if (document.number.number1.value.length==1) {
  console.log("ddd");
  document.number.number2.focus();
  if (document.number.number2.value.length==1){
    document.number.number3.focus();
    if (document.number.number3.value.length==1){
      document.number.number4.focus();
      if(document.number.number4.value.length==1){
        code=document.number.number1.value + document.number.number2.value + document.number.number3.value + document.number.number4.value;
        if(code==code2){
          alert("암호가 일치합니다.");
          $('#number1').val('');
          $('#number2').val('');
          $('#number3').val('');
          $('#number4').val('');
          location.href="#password2";
        }
        else{
          alert("암호가 일치하지 않습니다.");
          $('#number1').val('');
          $('#number2').val('');
          $('#number3').val('');
          $('#number4').val('');
          location.href="#main";
        }
      }
    }
  }
}
return;
}
//암호 수정
function change_Pass() {
if (document.number2.number5.value.length==1) {
  document.number2.number6.focus();
  if (document.number2.number6.value.length==1){
    document.number2.number7.focus();
    if (document.number2.number7.value.length==1){
      document.number2.number8.focus();
      if(document.number2.number8.value.length==1){
        code2=document.number2.number5.value + document.number2.number6.value + document.number2.number7.value + document.number2.number8.value;
          alert("변경된 암호는 <"+code2+"> 입니다!");
          $('#number5').val('');
          $('#number6').val('');
          $('#number7').val('');
          $('#number8').val('');
          isPassword = True
          location.href="#main";
        }
      }
    }
  }
return;
}

//암호 체크(main 화면)
function check_Pass_main() {
  if (document.number.number1.value.length==1) {
    document.number.number2.focus();
    if (document.number.number2.value.length==1){
      document.number.number3.focus();
      if (document.number.number3.value.length==1){
        document.number.number4.focus();
        if(document.number.number4.value.length==1){
          code=document.number.number1.value + document.number.number2.value + document.number.number3.value + document.number.number4.value;
          if(code==code2){
            $('#number1').val('');
            $('#number2').val('');
            $('#number3').val('');
            $('#number4').val('');
            location.href="main.html";
          }
          else{
            alert("암호가 일치하지 않습니다.");
            $('#number1').val('');
            $('#number2').val('');
            $('#number3').val('');
            $('#number4').val('');
          }
        }
      }
    }
  }
  return;
  }