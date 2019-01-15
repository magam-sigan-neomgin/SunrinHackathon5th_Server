$(document).ready(() => {
  $("#user").submit(false);
  $("#submit").click(submit);
});

function submit() {
  const ID = $("#id").val();
  const PW = $("#pw").val();
  if (ID != "" && PW != "") {
    idValidation(ID, (result) => {
      if (result == true) {
        alert("중복된 아이디 입니다. 다시 입력해 주세요");
      }
      else {
        signup(ID, PW);
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
      cb(data['responseJSON']['idCheck']);
    }
  });
}

function signup(id, pw) {
  $.ajax({
    url: '/signup',
    type: 'POST',
    data: { 'id': id, 'pw': pw },
    dataType: 'json'
  });
}