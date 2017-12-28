// author kaharisman ramdhani
// harus diletakan setelah jquery dan pagination
/*version 1.1*/
var page = window.location.href;
  var url_data = page+'/data';
  var url_editor = page+'/editor';
  var url_get = page+'/get';
  var url_simpan = page+'/add';
  var url_edit =  page+'/get_for_edit';
  var url_update =  page+'/update';
  var url_hapus =  page+'/delete';

$().ready(function(){
  $(".input_number").keypress(function(event){
    return (event.which >= 48 && event.which <= 57) || event.which == 8 || event.which == 0 ;
  })

// Menampilkan form tambah data
  $('body').on('click', '#btn_add', function() {
      editor_page();
  });

  $('body').on('click', '#btn_cancel', function() {
    data_page();
  });

  // Aksi pada saat tombol edit di klik
  $('body').on('click', '.btn_edit', function() {
     var id = $(this).val();
     editor_page(id);
  });

  // Aksi pada saat tombol hapus di klik
  $('body').on('click', '.btn_delete', function() {
    var id = $(this).val();
    if (confirm("Yakin untuk menghapus data?")) {
       remove(id);
    }
  });

  // Aksi pada saat tombol simpan di klik
  $('body').on('click', '#btn_save', function() {
    if(validate()){
      var data = $('form').serialize();
      insert(data)
    }
  });

 // Aksi pada saat tombol update di klik
 $('body').on('click', '#btn_update', function() {
   if( validate()){
     var data = $('form').serialize();
     update(data);
   }
 });
 });


// Aksi pada saat tombol enter ditekan
    $("form").keypress(function (e) {
     if (e.which == 13) {
       e.preventDefault()
       var data = $('form').serialize();;
       if($("#simpan").is(":visible")){
         insert(data,url_simpan,url_get)
       }
       if($("#update").is(":visible")){
         update(data,url_update,url_get);
       }
     }
 });


// -----------------------------------------------------------------------------------------------------------
// --------------------------------------- DAFTAR FUNGSI -----------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
function notify_error(message){
  $.notify({
    title: "Error :",
    message: message,
    icon: 'fa fa-remove'
  },{
    type: "danger",
    animate: {
  enter: 'animated bounceIn',
  exit: 'animated rotateOutUpLeft'
  }
  });
}

function notify_success(message){
  $.notify({
    title: "Error :",
    message: message,
    icon: 'fa fa-check'
  },{
    type: "success",
    animate: {
  enter: 'animated zoomIn',
  exit: 'animated rotateOutUpLeft'
  }
  });
}

//Menampilkan halaman data
function data_page(){
  $.post(url_data).done(function(data){
    $("#page_content").html(data);
  });
}

//Menampilkan halaman editor
function editor_page(id = null){

  get_content = $.post(url_editor).done(function(data){
    $("#page_content").html(data);
  });
  get_content.done(function(){
    $('.edit_page').hide();

  //cek apabila ada id nya berarti halaman edit, masukan datanya kedalam form
    if(id){
      request = $.get(url_edit,{id: id});
      request.done(function(data){
        $('.edit_protection').prop('readonly', true);
        var arr = JSON.parse(data);
        $.each(arr[0], function(key, value){
          var id_val = key;
          $("#"+id_val).val(value);
        });
        $('.add_page').hide();
        $('.edit_page').show();

      });
      request.fail(function() {
        notify_error('Terjadi Kesalahan');
    })
  }

  })
}

function validate(){
  var valid = true;
  $('.input_validation').each(function() {
    if(!this.value){
      valid = false;
      $.notify({
        title: "Error :",
        message: "Data inputan tidak boleh kosong!",
        icon: 'fa fa-remove'
      },{
        type: "danger"
      });
    $(this).addClass("focus");
 }
});
return valid;
}

//Update data
function update(data){
  request =  $.post(url_update, {data: data});
  request.done(function(data){
    notify_success('Data berhasil di update');
    data_page();
  })
  request.fail(function() {
    notify_error('Terjadi Kesalahan');
})
}

// fungsi hapus
function remove(id){
  request =  $.post(url_hapus, {id: id});
  request.done(function(data){
    notify_success('Data berhasil dihapus');
    data_page();
  })
  request.fail(function() {
    notify_error('Terjadi Kesalahan');
})
}

// fungsi simpan
function insert(data){

  request =  $.post(url_simpan, {data: data});
  request.done(function(data){
    notify_success('Data berhasil disimpan');
    data_page();
  })
  request.fail(function() {
    notify_error('Terjadi Kesalahan');
})

}
