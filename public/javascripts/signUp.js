$(document).ready(() => {
  $("#user").submit(false);
  $("#submit").click(submit);
});

function submit() {
  let ID = $("#id").val();
  let PW = $("#pw").val();
  const USERNAME = $("#username").val();
  const THUMBNAIL = $("#thumbnail").prop('files');
  if (ID != "" && PW != "" && USERNAME != "") {
    idValidation(ID, (result) => {
      if (result == true) {
        alert("중복된 아이디 입니다. 다시 입력해 주세요");
      }
      else {
        signup(ID, PW, USERNAME, THUMBNAIL);
        window.location.href = "/signin";
      }
    });
  }
}

function idValidation(id, cb) {
  $.ajax({
    url: '/idcheck',
    type: 'POST',
    data: { 'id': id },
    dataType: 'json',
    complete: (data) => {
      console.log(JSON.stringify(data));
      cb(data['responseJSON']['idCheck']);
    }
  });
}

function signup(id, pw, username, thumbnail) {
  $.ajax({
    url: '/register',
    type: 'POST',
    data: { 'id': id, 'pw': pw, 'username': username, 'thumbnail': thumbnail },
    dataType: 'json'
  });
}