

    let valor_original = $("#resposta_js_valor").text()
    let valor_total_original = $("#valor_total").text()
    let total_final =  $("#valor_total_final").text()

$('input[type=radio][name=desconto_option]').on('change', function() {
    let novo_va;
    let res;
    switch ($(this).val()) {
      case 'desconto':
        $("#resposta_js").text("Descontos");
        novo_val = parseFloat(valor_original.slice(2));//num
        res = "R$" +novo_val.toFixed(0)//String

        org_val_total = parseFloat(valor_total_original.slice(2))//num
        res_total = "R$" + (org_val_total-novo_val);//string

        $("#resposta_js_valor").text(res);//desconto
        $("#valor_total_final").text(res_total); //valor final
        break;
      case 'cashback':
        $("#resposta_js").text("Cashback");
        
       
        novo_val = parseFloat(valor_original.slice(2))*1.4;//num
        res = "R$" +novo_val.toFixed(0)//String

        org_val_total = parseFloat(valor_total_original.slice(2))//num
        res_total = "R$" + (org_val_total-novo_val);//string

        $("#resposta_js_valor").text(res);//desconto
        $("#valor_total_final").text(res_total); //valor final
        break;
      case 'doar':
        $("#resposta_js").text("Valor a ser doado");

        
        novo_val = parseFloat(valor_original.slice(2));//num
        res = "R$" +novo_val.toFixed(0)//String

        org_val_total = parseFloat(valor_total_original.slice(2))//num
        res_total = "R$" + (org_val_total+novo_val);//string

        $("#resposta_js_valor").text(res);//desconto
        $("#valor_total_final").text(res_total); //valor final
        break;
    }
  });