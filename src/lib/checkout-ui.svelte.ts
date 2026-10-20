// Shared checkout UI state. Both the header button and the product page read
// it, so either entry point shows "Abriendo..." while the overlay opens.
export const checkoutUi = $state({ opening: false });
