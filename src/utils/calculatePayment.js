export function calculatePayment(devengados, deducciones, dbDevengados, dbDeducciones) {
    const totalDevengados = devengados.reduce((sum, item) => sum + parseFloat(item.valor || 0), 0) +
        dbDevengados.reduce((sum, item) => sum + parseFloat(item.valor || 0), 0);

    const totalDeducciones = deducciones.reduce((sum, item) => sum + parseFloat(item.valor || 0), 0) +
        dbDeducciones.reduce((sum, item) => sum + parseFloat(item.valor || 0), 0);

    return totalDevengados - totalDeducciones;
}