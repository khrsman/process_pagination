// author kaharisman ramdhani
// harus diletakan setelah jquery dan pagination

$().ready(function(){
  var page = window.location.href;
    var url_get = page+'/get';
    var url_simpan = page+'/add';
    var url_edit =  page+'/get_for_edit';
    var url_update =  page+'/update';
    var url_hapus =  page+'/delete';

  $(".input_number").keypress(function(event){
    return (event.which >= 48 && event.which <= 57) || event.which == 8 || event.which == 0 ;
  })



// Menampilkan form tambah data
  $('#btn_add_page').click(function(){
    if($('#data_view').is(':visible')){
      $('.add_page').show();
      $('.edit_page').hide();
      $('.edit_protection').prop('readonly', false);
      // $('#data_view').toggle( "slide", 'slow', function(){$('#form_view').toggle( "slide");});
      $('#data_view').hide();
      $('#form_view').show();
    } else{
      // $('#form_view').toggle( "slide", 'slow', function(){$('#data_view').toggle( "slide");});
    }
  });
  $('#btn_cancel_page').click(function(){
    $('#data_view').show();
    $('#form_view').hide();
  });



  // Aksi pada saat tombol edit di klik
  $('body').on('click', '.btn_edit', function() {
    var id = $(this).val();
     edit_page(id,url_edit);
  });
  // Aksi pada saat tombol hapus di klik
  $('body').on('click', '.btn_delete', function() {
    var id = $(this).val();
    remove(id,url_hapus);
  });

  // Aksi pada saat tombol simpan di klik
  $('#btn_save').click(function(){
  if(validation()){
    var data = $('form').serialize();
    insert(data,url_simpan)
  }

  });


 // Aksi pada saat tombol update di klik
  $('#btn_update').click(function(){
    // kirim data form berdasarkan nama(property name) inputannya
  if( validation()){
    var data = $('form').serialize();
    update(data,url_update);
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

function validation(){
  var valid = true;
  $('.input_validation').each(function() {
    if(!this.value){
      valid = false;
      var lbl = $(this).parent().prev("label").text();
      $.notify({
        title: "Error :",
        message: lbl+" harus diisi!",
        icon: 'fa fa-check'
      },{
        type: "danger"
      });
    $(this).addClass("focus");
 }
});
return valid;
}


function edit_page(id,url_edit){
  $.ajax({
      type: "GET",
      url: url_edit,
      data: {id: id},
      success: function (resdata) {
        $('.edit_page').show();
        $('.edit_protection').prop('readonly', true);
        $('.add_page').hide();
      $('#data_view').hide();
      $('#form_view').show();

      var arr = JSON.parse(resdata);
      $.each(arr[0], function(key, value){
        var id_val = key;
        $("#"+id_val).val(value);
      });

      },
      error: function (jqXHR, exception) {
        // pesan error menggunakan notify.js
        $.notify({
          title: "Error :",
          message: "Telah terjadi kesalahan!",
          icon: 'fa fa-check'
        },{
          type: "danger"
        });
      }
  });
}

// fungsi update
function update(data,url_update){
  $.ajax({
      type: "POST",
      url: url_update,
      data: {data: data},
      success: function (resdata) {
        $.notify({
          title: "Berhasil : ",
          message: "Data telah diupdate",
          icon: 'fa fa-check'
        },{
          type: "success"
        });
          pagination.init();
          $(".xform")[0].reset();
          $('#data_view').show();
          $('#form_view').hide();

          // loadDataTable(url_get);
          // $('#form_tambah').toggle( "slide", 'slow', function(){$('#tabel').toggle( "slide");});
            // location.reload();
      },
      error: function (jqXHR, exception) {
        // pesan error menggunakan notify.js
        $.notify({
          title: "Error :",
          message: "Telah terjadi kesalahan!",
          icon: 'fa fa-check'
        },{
          type: "danger"
        });
      }
  });
}

// fungsi hapus
function remove(id,url_hapus){
  $.ajax({
      type: "GET",
      url: url_hapus,
      data: {id: id},
      success: function (resdata) {
        $.notify({
          title: "Berhasil : ",
          message: "Data berhasil dihapus",
          icon: 'fa fa-check'
        },{
          type: "success"
        });
        pagination.init();

      },
      error: function (jqXHR, exception) {
        // pesan error menggunakan notify.js
        $.notify({
          title: "Error :",
          message: "Telah terjadi kesalahan!",
          icon: 'fa fa-check'
        },{
          type: "danger"
        });
      }
  });
}

// fungsi simpan
function insert(data, url_simpan){

  $.ajax({
      type: "POST",
      url: url_simpan,
      data: {data: data},
      success: function (resdata) {
        $.notify({
          title: "Berhasil : ",
          message: "Data telah ditambahkan",
          icon: 'fa fa-check'
        },{
          type: "success"
        });
        pagination.init();
          $(".xform")[0].reset();
 	  $('#data_view').show();
          $('#form_view').hide();
         // loadDataTable(url_get);
          //$('#form_tambah').toggle( "slide", 'slow', function(){$('#tabel').toggle( "slide");});

            // location.reload();
      },
      error: function (jqXHR, exception) {
        // pesan error menggunakan notify.js
        $.notify({
          title: "Error :",
          message: "Telah terjadi kesalahan!",
          icon: 'fa fa-check'
        },{
          type: "danger"
        });
      }
  });
}
