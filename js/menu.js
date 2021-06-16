// menu 나오는 시간 설정
var giMenuDuration = 300;
// 전체 메뉴를 오른쪽으로 슬라이드하여서 보여준다.
var flag=0;
function ShowMenu(){
    $('.menu_bg' ).css( { 'display' : 'block' } );
    $('.menu' ).css( { 'left' : '-100%' } );
    $('.menu' ).animate( { left: '0px' }, { duration: giMenuDuration } );
}
// 전체 메뉴를 왼쪽으로 슬라이드하여서 닫는다.
function HideMenu(){
    $('.menu' ).animate( { left: '-100%' }, { duration: giMenuDuration, complete:function(){ $('.menu_bg' ).css( { 'display' : 'none' } ); } } );
}