let finalyResponse;

let expression = {
	'>=' : (x, y) => x >= y,
	'<=' : (x, y) => x <= y,
	'>' : (x, y) => x > y,
	'<' : (x, y) => x < y,
	'==' : (x, y) => x == y,
}

function calcularPreco(quantidade) {

	let venda = 0;
	let comissao = 0;
	let lucro = 0;
	let fornecedor = 0;
	const qtdIndex = quantidade / finalyResponse.qtd;
	const qtdEscolhida=quantidade;
	
	if(qtdEscolhida < parseInt(finalyResponse.quant[0])){
		const precoMinFornecedor = parseFloat(finalyResponse.preco_min);
		fornecedor = precoMinFornecedor;
		venda = precoMinFornecedor+(precoMinFornecedor*finalyResponse.valorVendaComissaoMin[`venda`]/100);
		comissao = venda*finalyResponse.valorVendaComissaoMin[`comissao`]/100;
		lucro = venda-(comissao+fornecedor);
	}else{
		finalyResponse.quant.forEach((quant, index) => {
			if(expression[finalyResponse.parametro[index]](qtdEscolhida, quant) ){
				const precoFornecedor = qtdIndex * finalyResponse.valor[index];
				fornecedor = precoFornecedor;
				venda = precoFornecedor+(precoFornecedor*finalyResponse.valorVendaComissao[`venda`][index]/100);
				comissao = venda*finalyResponse.valorVendaComissao[`comissao`][index]/100;
				lucro = venda-(comissao+fornecedor);
			}
		});
	}
	return {
		fornecedor: fornecedor.toFixed(2).toString().replace(".", ","), 
		venda: venda.toFixed(2).toString().replace(".", ","), 
		comissao: comissao.toFixed(2).toString().replace(".", ","),
		lucro: lucro.toFixed(2).toString().replace(".", ",")
	}
}