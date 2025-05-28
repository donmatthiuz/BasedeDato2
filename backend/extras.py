def detect_extra_properties(transaction_data):
    
    expected_transaction_keys = {
        'transactionAmount', 'transactionDescription', 'transactionLocation', 'transactionType',
        'customer', 'account', 'merchant', 'device'
    }
    expected_customer_keys = {'customer_name', 'channel', 'deviceUsed'}
    expected_account_keys = {'branch_account', 'balanceBefore', 'balanceAfter'}
    
    extra_transaction = {}  # Diccionario para propiedades extra en transactionData
    extra_customers = []  # Lista para propiedades extra en cada customer
    extra_accounts = []   # Lista para propiedades extra en cada account

    # Detectar propiedades extra en transactionData
    extra_keys_transaction = set(transaction_data.keys()) - expected_transaction_keys
    if extra_keys_transaction:
        extra_transaction = {key: transaction_data[key] for key in extra_keys_transaction}
    
    # Procesar la lista de "customer"
    for customer in transaction_data.get('customer', []):
        extra_keys = set(customer.keys()) - expected_customer_keys
        if extra_keys:
            extra_customers.append({key: customer[key] for key in extra_keys})
    
    # Procesar la lista de "account"
    for account in transaction_data.get('account', []):
        extra_keys = set(account.keys()) - expected_account_keys
        if extra_keys:
            extra_accounts.append({key: account[key] for key in extra_keys})
    
    return extra_transaction, extra_customers, extra_accounts