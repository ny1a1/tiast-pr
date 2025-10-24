from pymodbus.server.sync import StartTcpServer
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext
from pymodbus.datastore import ModbusSequentialDataBlock
import logging

logging.basicConfig()
log = logging.getLogger()
log.setLevel(logging.INFO)

store = ModbusSlaveContext(
    hr=ModbusSequentialDataBlock(0, [10]*100),
    ir=ModbusSequentialDataBlock(0, [20]*100),
    co=ModbusSequentialDataBlock(0, [1]*100),
    di=ModbusSequentialDataBlock(0, [0]*100),
    zero_mode=True
)

context = ModbusServerContext(slaves=store, single=True)

# Повідомлення перед запуском
log.info("Starting Modbus TCP Server on 0.0.0.0:502...") 

# Перевірка помилок
try:
    StartTcpServer(context, address=("0.0.0.0", 502))
except Exception as e:
    log.error(f"Failed to start Modbus Server: {e}")