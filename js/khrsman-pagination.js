// author kaharisman ramdhani

/*version 1.1*/


(function( $ ) {
    $.fn.pagination = function(options) {
      var settings = $.extend({
       plus_column: [0,{'href':'','id':'','text':''}],
        href: "null",
        edit: false,
        edit_custom: false,
        delete: false,
        search: false,
        hide: false,
      },options);

      var table = this;

    return {
        init: function(){
          paging();
          if(settings.search){
            $('body').on('keyup', '#search_data', function(){
               paging(settings.href+"?query="+this.value,this.value)
            });
          }
        }
    }

      function paging(href,query){
        if (!href){
          href = settings.href;
        }

         $.get(href).done(function( data ) {
          var obj = jQuery.parseJSON(data);
          table.empty();
          $('#page').empty();

          //--------------------------------------------------------------------------------------------------->
          //------------------------------------- Search form  ------------------------------------------------>
          //--------------------------------------------------------------------------------------------------->
            if(settings.search){
           judul2 = '<div class="search">Cari <input type="text" id="search_data" value="'+query+'"/></div>';
           if($(".search").length == 0 ){
             judul2 = '<div class="search">Search <input type="text" id="search_data" value=""/></div>';
             table.before(judul2);
           }
         }

         //--------------------------------------------------------------------------------------------------->
         //------------------------------------- Header Tabel  ----------------------------------------------->
         //--------------------------------------------------------------------------------------------------->

           title = "";
           max_plus = settings.plus_column[0] - 1;
           css ="class='pagination_detail'";
           link_page = settings.href.split('?from')[0];


           head = table.append('<thead>');
           body = table.append('<tbody>');


           var column_name = Object.keys(obj.value[0]);
           //isi header
           for (var i = 0; i < column_name.length; i++) {
            // column tambahan pada awal tabel
            // joinkan menjadi 1 header saja
             if(i < settings.plus_column[0]){
               if(i == 0){
                  title =   title + '<th colspan = '+max_plus+' class="pagination_detail" >'+column_name[0]+'</th>';
               }
             } else{
               // hidden column
               if (column_name[i] != settings.hide){
               title =   title + '<th>'+column_name[i]+'</th>';
             }
             }
           }

           // header button edit/delete
          if (settings.edit || settings.delete ){
           title = title + '<th class="pagination_action">Aksi</th>';
         }
           judul = $('<tr>').append(title);
           head.find('thead').append(judul);


           //--------------------------------------------------------------------------------------------------->
           //------------------------------------- Isi Tabel  -------------------------------------------------->
           //--------------------------------------------------------------------------------------------------->
            $.each(obj.value, function(key,value) {
                var content = "";

                // ambil isi datanya berdasarkan nama kolomnya
                for (var i = 0; i < column_name.length; i++) {
                  // kolom tambahan
                  // pada select database, kolom pertama setelah tambahan harus primary key
                  if(i<settings.plus_column[0]){
                    val_id = value[settings.plus_column[i+1]['id']];
                    content = detailColumn(val_id, i, content);
                  }
                  // kolom normal
                   else{
                     if (column_name[i] != settings.hide){ //hidden column
                      content =  content+'<td>'+value[column_name[i]]+'</td>';
                   }
                  }
                }

              // isi kolom aksi
              if (settings.edit || settings.delete) {
                content += '<td class="pagination_action">';
              if (settings.edit){
                if (settings.edit_custom) {
                  edit_button = '<button value="'+value[settings.edit]+'" class="btn_edit_custom" > Edit</button> ';
                }else {
                  edit_button = '<button value="'+value[settings.edit]+'" class="btn_edit" > Edit</button> ';
                }
              content +=  edit_button;
              }
              if (settings.delete){
                delete_button = '<button value="'+value[settings.delete]+'" class="btn_delete"> Delete </button>';
                  content += delete_button;
              }
              content += '</td>';
            }

                isi= $('<tr class="data_detail">').append(content);
                body.find('tbody').append(isi);
            });

            tfoot = "<tfoot><tr><td colspan ="+column_name.length+"><div id='paging' class='paging'><ul id='page'></ul></div></td?</tr></tfoot>";
            body.find('tbody').after(tfoot);

            $.each(obj.page, function(key,value) {
            $('<li>').append($('<a>', {
                      text: value.page,
                      href: link_page+"?from="+value.from,
                      addClass: "page gradient"
                  })).appendTo('#page');
            });

            //fungsi onClick Pagination
            $('li',table).click(function onClick(e){
              e.preventDefault();
              val = $(this).find("a").attr("href");
              paging(val);
                });
          });
        }

        // fungsi untuk kolom detail
        function detailColumn(val,i,content){
          href = settings.plus_column[i+1].href;
          id = settings.plus_column[i+1].id;
          text = settings.plus_column[i+1].text;
          var detail = ' <a href ="'+href+id+'='+ val +'" class="btn_detail " id="btn_detail" > '+text+' </a> ';
          if(i==0){
            content =  '<td class="pagination_detail">'+content+detail;
          }else if(i==max_plus){
           content =  content+detail+'</td>';
         } else{
           content =  content+detail;
         }
         return content;
        }

    }
}( jQuery ));
