// inicia el juego
function Iniciar() {

	//colorBlink('h1.main-titulo');
	BrillarTitulo();

	$('.btn-reinicio').click(function () {
		if ($(this).text() === 'Reiniciar') {
			location.reload(true);
		}
		VerificaTablero();
		$(this).text('Reiniciar');
		$('#timer').startTimer({
			onComplete: Final
		})
	});
}

// Prepara el juego
$(function() {
	Iniciar();
});




//punto 1. cambia el color del titulo y alterna entre dos colores

function BrillarTitulo() {
	$('.main-titulo').animate
	({
		 color: 'white'
	 },300, function(){$('.main-titulo').animate
	 ({
		  color: 'yellow'
	  },300,);
	  BrillarTitulo();
	}
	 );
}

//generar números aleatorios 
function Aleatorio(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

// obtiene filas de dulces o columas
function ArregloDeDulces(arrayType, index) {

	var DulceCol1 = $('.col-1').children();
	var DulceCol2 = $('.col-2').children();
	var DulceCol3 = $('.col-3').children();
	var DulceCol4 = $('.col-4').children();
	var DulceCol5 = $('.col-5').children();
	var DulceCol6 = $('.col-6').children();
	var DulceCol7 = $('.col-7').children();

	var candyColumns = $([DulceCol1, DulceCol2, DulceCol3, DulceCol4,
		DulceCol5, DulceCol6, DulceCol7
	]);

	if (typeof index === 'number') {
		var candyRow = $([DulceCol1.eq(index), DulceCol2.eq(index), DulceCol3.eq(index),
			DulceCol4.eq(index), DulceCol5.eq(index), DulceCol6.eq(index),
			DulceCol7.eq(index)
		]);
	} else {
		index = '';
	}

	if (arrayType === 'columns') {
		return candyColumns;
	} else if (arrayType === 'rows' && index !== '') {
		return candyRow;
	}
}

// arreglos de filas
function dulcesRenglones(index) {
	var candyRow = ArregloDeDulces('rows', index);
	return candyRow;
}

// arreglos de colunmnas
function dulcescols(index) {
	var candyColumn = ArregloDeDulces('columns');
	return candyColumn[index];
}

//verifica los dulces que se eliminarán en una columna
function ValidacionColumnas() {
	for (var j = 0; j < 7; j++) {
		var counter = 0;
		var candyPosition = [];
		var extraCandyPosition = [];
		var candyColumn = dulcescols(j);
		var comparisonValue = candyColumn.eq(0);
		var gap = false;
		for (var i = 1; i < candyColumn.length; i++) {
			var srcComparison = comparisonValue.attr('src');
			var srcCandy = candyColumn.eq(i).attr('src');

			if (srcComparison != srcCandy) {
				if (candyPosition.length >= 3) {
					gap = true;
				} else {
					candyPosition = [];
				}
				counter = 0;
			} else {
				if (counter == 0) {
					if (!gap) {
						candyPosition.push(i - 1);
					} else {
						extraCandyPosition.push(i - 1);
					}
				}
				if (!gap) {
					candyPosition.push(i);
				} else {
					extraCandyPosition.push(i);
				}
				counter += 1;
			}
			comparisonValue = candyColumn.eq(i);
		}
		if (extraCandyPosition.length > 2) {
			candyPosition = $.merge(candyPosition, extraCandyPosition);
		}
		if (candyPosition.length <= 2) {
			candyPosition = [];
		}
		candyCount = candyPosition.length;
		if (candyCount >= 3) {
			deleteColumnCandy(candyPosition, candyColumn);
			setScore(candyCount);
		}
	}
}
function deleteColumnCandy(candyPosition, candyColumn) {
	for (var i = 0; i < candyPosition.length; i++) {
		candyColumn.eq(candyPosition[i]).addClass('delete');
	}
}

// Valida si hay dulces que deben eliminarse en una fila
function validarRenglones() {
	for (var j = 0; j < 6; j++) {
		var counter = 0;
		var candyPosition = [];
		var extraCandyPosition = [];
		var candyRow = dulcesRenglones(j);
		var comparisonValue = candyRow[0];
		var gap = false;
		for (var i = 1; i < candyRow.length; i++) {
			var srcComparison = comparisonValue.attr('src');
			var srcCandy = candyRow[i].attr('src');

			if (srcComparison != srcCandy) {
				if (candyPosition.length >= 3) {
					gap = true;
				} else {
					candyPosition = [];
				}
				counter = 0;
			} else {
				if (counter == 0) {
					if (!gap) {
						candyPosition.push(i - 1);
					} else {
						extraCandyPosition.push(i - 1);
					}
				}
				if (!gap) {
					candyPosition.push(i);
				} else {
					extraCandyPosition.push(i);
				}
				counter += 1;
			}
			comparisonValue = candyRow[i];
		}
		if (extraCandyPosition.length > 2) {
			candyPosition = $.merge(candyPosition, extraCandyPosition);
		}
		if (candyPosition.length <= 2) {
			candyPosition = [];
		}
		candyCount = candyPosition.length;
		if (candyCount >= 3) {
			deleteHorizontal(candyPosition, candyRow);
			setScore(candyCount);
		}
	}
}
function deleteHorizontal(candyPosition, candyRow) {
	for (var i = 0; i < candyPosition.length; i++) {
		candyRow[candyPosition[i]].addClass('delete');
	}
}

//contador de puntuacion muestra la puntuacion
function setScore(candyCount) {
	var score = Number($('#score-text').text());
	switch (candyCount) {
		case 3:
			score += 25;
			break;
		case 4:
			score += 50;
			break;
		case 5:
			score += 75;
			break;
		case 6:
			score += 100;
			break;
		case 7:
			score += 200;
	}
	$('#score-text').text(score);
}

//pone los elemento caramelo en el tablero
function VerificaTablero() {
	RellenarTablero();
}

function RellenarTablero() {
	var lineas = 6;
	var c = $('[class^="col-"]');

	c.each(function () {
		var dulces = $(this).children().length;
		var agrega = lineas - dulces;
		for (var i = 0; i < agrega; i++) {
			var tipodulce = Aleatorio(1, 5);
			if (i === 0 && dulces < 1) {
				$(this).append('<img src="image/' + tipodulce + '.png" class="element"></img>');
			} else {
				$(this).find('img:eq(0)').before('<img src="image/' + tipodulce + '.png" class="element"></img>');
			}
		}
	});
	addCandyEvents();
	setValidations();
}

// Si hay dulces que borrar
function setValidations() {
	ValidacionColumnas();
	validarRenglones();
	// Si hay dulces que borrar
	if ($('img.delete').length !== 0) {
		EliminaAutomatica();
	}
}


// Drag and drop para los dulces
//efecto de movimiento entre los caramelos
function addCandyEvents() {
	$('img').draggable({
		containment: '.panel-tablero',
		droppable: 'img',
		revert: true,
		revertDuration: 500,
		grid: [100, 100],
		zIndex: 10,
		drag: constrainCandyMovement
	});
	$('img').droppable({
		drop: swapCandy
	});
	enableCandyEvents();
}

function disableCandyEvents() {
	$('img').draggable('disable');
	$('img').droppable('disable');
}

function enableCandyEvents() {
	$('img').draggable('enable');
	$('img').droppable('enable');
}

//hace que el caramelo sea solido al moverse
function constrainCandyMovement(event, candyDrag) {
	candyDrag.position.top = Math.min(100, candyDrag.position.top);
	candyDrag.position.bottom = Math.min(100, candyDrag.position.bottom);
	candyDrag.position.left = Math.min(100, candyDrag.position.left);
	candyDrag.position.right = Math.min(100, candyDrag.position.right);
}

//reemplaza a los dulces anteriores
function swapCandy(event, candyDrag) {
	var candyDrag = $(candyDrag.draggable);
	var dragSrc = candyDrag.attr('src');
	var candyDrop = $(this);
	var dropSrc = candyDrop.attr('src');
	candyDrag.attr('src', dropSrc);
	candyDrop.attr('src', dragSrc);

	setTimeout(function () {
		VerificaTablero();
		if ($('img.delete').length === 0) {
			candyDrag.attr('src', dragSrc);
			candyDrop.attr('src', dropSrc);
		} else {
			actualizaMovimientos();
		}
	}, 500);

}

function checkBoardPromise(result) {
	if (result) {
		VerificaTablero();
	}
}

//valida la puntuacion por cantidad de elementos en linea
function actualizaMovimientos() {
	var actualValue = Number($('#movimientos-text').text());
	var result = actualValue += 1;
	$('#movimientos-text').text(result);
}

//eliminacion automatica de los elementos
function EliminaAutomatica() {
	disableCandyEvents();
	$('img.delete').effect('bounce', 300);
	$('img.delete').animate({
			opacity: '0'
		}, {
			duration: 100
		})
		.animate({
			opacity: '0'
		}, {
			duration: 300,
			complete: function () {
				eliminaDulces()
					.then(checkBoardPromise)
					.catch(showPromiseError);
			},
			queue: true
		});
}

//llenado automatico de los espacios con elementos 
function showPromiseError(error) {
	console.log(error);
}

function eliminaDulces() {
	return new Promise(function (resolve, reject) {
		if ($('img.delete').remove()) {
			resolve(true);
		} else {
			reject('No se pudo eliminar Candy...');
		}
	})
}

//Temporizador y boton reiniciar
//cambia el aspecto de la página
//final del juego
function Final() {
	$('div.panel-tablero, div.time').effect('fold');
	$('h1.main-titulo').addClass('title-over')
		.text('Gracias por jugar!');
	$('div.score, div.moves, div.panel-score').width('100%');
	
}


