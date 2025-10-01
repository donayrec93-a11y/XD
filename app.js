// Funcionalidad para el menú móvil
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }
  
  // Cerrar el menú al hacer clic en un enlace
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('active');
    });
  });
  
  // Inicializar cálculo de precios dinámico si estamos en la página de nueva boleta
  if (document.querySelector('.item-row')) {
    initPriceCalculation();
  }
});

// Cálculo dinámico de precios
function initPriceCalculation() {
  // Función para actualizar el precio unitario basado en el tipo, cantidad y servicio
  function updatePriceUnit(row) {
    const tipoSelect = row.querySelector('[name="item_tipo[]"]');
    const cantidadInput = row.querySelector('[name="item_cantidad[]"]');
    const lavadoSelect = row.querySelector('[name="item_lavado[]"]');
    const perfumadoCheck = row.querySelector('[name="item_perfumado[]"]');
    const punitInput = row.querySelector('[name="item_punit[]"]');
    
    if (!tipoSelect || !cantidadInput || !lavadoSelect || !punitInput) return;
    
    const tipo = tipoSelect.value;
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const lavado = lavadoSelect.value;
    const perfumado = perfumadoCheck && perfumadoCheck.checked;
    
    // Precios base (deben coincidir con config_precios.py)
    const precios = {
      kilo: 3.5,
      edredon: 15.0,
      terno: 20.0
    };
    
    // Recargos
    const recargos = {
      normal: 0.0,
      seco: 2.0,
      mano: 1.5
    };
    
    const recargoPerfumado = 0.5;
    
    // Calcular precio unitario
    let precioBase = precios[tipo] || 0;
    let recargoServicio = recargos[lavado] || 0;
    let precioUnitario = precioBase + recargoServicio;
    
    if (perfumado) {
      precioUnitario += recargoPerfumado;
    }
    
    // Solo sugerir el precio unitario si el campo está vacío o no ha sido editado manualmente
    if (!punitInput._edited && (!punitInput.value || punitInput.value == 0)) {
      punitInput.value = precioUnitario.toFixed(2);
    }
    
    // Actualizar subtotal
    updateSubtotal(row);
  }
  
  // Actualizar subtotal de un ítem
  function updateSubtotal(row) {
    const cantidadInput = row.querySelector('[name="item_cantidad[]"]');
    const punitInput = row.querySelector('[name="item_punit[]"]');
    
    if (!cantidadInput || !punitInput) return;
    
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const punit = parseFloat(punitInput.value) || 0;
    
    const subtotal = cantidad * punit;
    
    // Mostrar subtotal si hay un elemento para ello
    const subtotalElement = row.querySelector('.subtotal');
    if (subtotalElement) {
      subtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
    }
    
    // Actualizar total general
    updateTotal();
  }
  
  // Actualizar el total de la boleta
  function updateTotal() {
    const punitInputs = document.querySelectorAll('[name="item_punit[]"]');
    const cantidadInputs = document.querySelectorAll('[name="item_cantidad[]"]');
    const totalElement = document.getElementById('total-amount');
    const aCuentaInput = document.querySelector('[name="a_cuenta"]');
    const saldoElement = document.getElementById('saldo-amount');
    
    if (!totalElement) return;
    
    let total = 0;
    
    for (let i = 0; i < punitInputs.length; i++) {
      const punit = parseFloat(punitInputs[i].value) || 0;
      const cantidad = parseFloat(cantidadInputs[i].value) || 0;
      total += punit * cantidad;
    }
    
    totalElement.textContent = `S/ ${total.toFixed(2)}`;
    
    // Actualizar saldo si existe
    if (aCuentaInput && saldoElement) {
      const aCuenta = parseFloat(aCuentaInput.value) || 0;
      const saldo = total - aCuenta;
      saldoElement.textContent = `S/ ${saldo.toFixed(2)}`;
    }
  }
  
  // Agregar listeners a todos los campos relevantes
  document.querySelectorAll('.item-row').forEach(row => {
    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
      if (input.name === 'item_punit[]') {
        input.addEventListener('input', function() {
          input._edited = true;
          updateSubtotal(row);
        });
      } else {
        input.addEventListener('change', () => updatePriceUnit(row));
        input.addEventListener('input', () => updatePriceUnit(row));
      }
    });
  });
  
  // Botón para agregar nueva fila
  const addRowBtn = document.getElementById('add-item-row');
  if (addRowBtn) {
    addRowBtn.addEventListener('click', function() {
      const itemsContainer = document.querySelector('.items-container');
      const template = document.querySelector('.item-row').cloneNode(true);
      
      // Limpiar valores
      template.querySelectorAll('input').forEach(input => {
        input.value = '';
      });
      
      // Resetear selects
      template.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
      });
      
      // Agregar listeners a la nueva fila
      const inputs = template.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('change', () => updatePriceUnit(template));
        input.addEventListener('input', () => updatePriceUnit(template));
      });
      
      // Agregar botón de eliminar
      const deleteBtn = template.querySelector('.delete-row');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
          template.remove();
          updateTotal();
        });
      }
      
      itemsContainer.appendChild(template);
    });
  }
  
  // Inicializar cálculos
  document.querySelectorAll('.item-row').forEach(updatePriceUnit);
}