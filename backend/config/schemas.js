


let common = {
    name: {
        type : 'string',
        minLength: 3,
        maxLength: 64
    },
    state: {
        type: 'string',
        minLength: 3,
        maxLength: 128
    },
    address: {
        type : 'string',
        minLength: 3,
        maxLength: 128
    },
    id: {
        type: 'integer',
        minimum: 1,
        maximum: 100000000
    },
    limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100
    },
    offset: {
        type: 'integer',
        minimum: 1
    },
    gst_no: {
        type: 'string',
        minLength: 0,
        maxLength: 36
    },
    number: {
        type : 'integer',
        min: 1000000
    },
    email: {
        type: 'string',
        format: 'email',    
        minLength: 3,
        maxLength: 128
    },
    description : {
        type: 'string',
        minLength: 3,
        maxLength: 256
    },
    igst: {
        type: 'number',
        minimum: 0
    },
    cgst: {
        type: 'number',
        minimum: 0
    },
    sgst: {
        type: 'number',
        minimum: 0
    },

    po_products: {
        type: 'array',
       
        "additionalItems": false,
        items: {
            required: ['product_id',
                        'project_id',
                        'quantity',
                        'delivered',
                        'avg_rate'
                        ],
            product_id: {
                type: 'integer',
                minimum: 1,
                maximum: 100000000,
                required: true
            },
            project_id: {
                type: 'integer',
                minimum: 1,
                maximum: 100000000,
                required: true
            },
            quantity: {
                type: 'integer',
                mininum: 1,
                maximum: 100000000,
                required: true
            },
            delivered: {
                type: 'integer',
                minimum: 0,
                required: true
            },
            avg_rate: {
                type: 'number',
                minimum: 0,
                required: true
            }
        }
    },
    po_products_patch: {
        type: 'array',
        
       
        "additionalItems": false,
        items: {
            required: ['product_id',
                        'project_id',
                        'quantity',
                        'avg_rate'
                        ],
            product_id: {
                type: 'integer',
                minimum: 1,
                maximum: 100000000,
                required: true
            },
            project_id: {
                type: 'integer',
                minimum: 1,
                maximum: 100000000,
                required: true
            },
            quantity: {
                type: 'integer',
                mininum: 1,
                maximum: 100000000,
                required: true
            },
            avg_rate: {
                type: 'number',
                minimum: 0,
                required: true
            }
        }
    },
    po_products_delivery: {
        type: 'array',
       
        "additionalItems": false,
        items: {
            required: ['product_id',
                        'project_id',
                        'delivered'
                        ],
            product_id: {
                type: 'integer',
                minimum: 1,
                maximum: 100000000,
                required: true
            },
            project_id: {
                type: 'integer',
                minimum: 1,
                maximum: 100000000,
                required: true
            },
            delivered: {
                type: 'integer',
                minimum: 0,
                required: true
            }
        }
    },


    roles: {
        type: 'object'
    }
    
}


const clients = {

    'GET': {
        properties: {
            client_id: common.id,
            limit: common.limit,
            offset: common.offset
        }
    },

    'POST' : {
        required:['name','state','address','project_type'
        ] ,
        properties: {
            
            name: common.name,
            state: common.state,
            address: common.address,
    
            gst_no: common.gst_no,

            project_type: {
                type: 'string',
                minLength: 3,
                maxLength: 64

	    }
    
            
        },
        
    },

    'PATCH' : {
        anyRequired: ["name","state","address","gst_no","project_type"],
        required: ['client_id'],
        properties: {
            client_id: common.id,
            name: common.name,
            state: common.state,
            address: common.address,
            gst_no: common.gst_no,
            project_type: {
                type: 'string',
                minLength: 3,
                maxLength: 64

            }
        },
        
    },

    'DELETE' : {

        required: ['client_id'],
        properties: {
            client_id: common.id
        },
    }
       
}



const projects = {

    'GET': {
        properties: {
            project_id: common.id,
            limit: common.limit,
            offset: common.offset
        },
    
    },

    'POST' : {
        allRequired: true,
        properties: {
            
            name: common.name,
            site_address: common.address,
            client_id: common.id,
            godown_name: common.name
    
            
        },
        
    },


    'PATCH' : {
        anyRequired: ["name","site_address","client_id","godown_name"],
        required: ['client_id'],
        properties: {
            project_id: common.id,
            name: common.name,
            site_address: common.address,
            client_id: common.id,
            godown_name: common.name
        }
        
    },

    'DELETE' : {

        required: ['project_id'],
        properties: {
            project_id: common.id
        },

        
        
    }
       
}


let roles = [
    'clients',
    'projects',
    'persons',
    'jobcard',
    'products',
    'inventory',
    'vendors',
    'purchase-orders',
    'stock-transfer'
]

const users = {

    'GET': {
        properties: {
            user_id: common.id
        },
    
    },

    'POST' : {
        allRequired: true,
        properties: {
            
            email: common.email,
            password: common.name,
            name: common.name,
            roles: {
                type: 'object',
                anyRequired: roles
            }
    
            
        },
        
    },


    'PATCH' : {
        anyRequired: ["email","password","roles"],
        required: ['user_id'],
        properties: {
            email: common.email,
            user_id: common.id,
            password: common.name,
            name: common.name,
            roles: common.roles
        }
        
    },

    'DELETE' : {

        required: ['user_id'],
        properties: {
            user_id: common.id
        },

        
        
    }
       
}


const persons = {

    'GET': {
        properties: {
            person_id: common.id,
            limit: common.limit,
            offset: common.offset
        }
    },

    'POST' : {
        required: ['name','designation','client_id',
                    'project_id','number'],
        properties: {
            name: common.name,
            email: common.email,
            designation: common.name,
            client_id: common.id,
            project_id: common.id,
            number: common.number
    
            
        }
    },


    'PATCH' : {
        anyRequired: ["name","email","designation","client_id","project_id","number"],
        required: ['person_id'],
        properties: {
            project_id: common.id,
            name: common.name,
            email: common.name,
            designation: common.name,
            client_id: common.id,
            project_id: common.id,
            number: common.number

        },
        
    },

    'DELETE' : {

        properties: {
            person_id: common.id
        },

        required: ['person_id']
        
    } 
}

const godowns = {

    'GET': {
        properties: {
            godown_id: common.id,
            limit: common.limit,
            offset: common.offset
        }
    },

    'POST' : {
        required: ['name','address'],
        properties: {
            name: common.name,
            address: common.address,
            project_id: common.id
            
        }
    }, 


    'PATCH' : {
        anyRequired: ["name","address","project_id"],
        required: ['godown_id'],
        properties: {
            godown_id: common.id,
            name: common.name,
            address: common.address,
            project_id: common.id

        },
        
    },

    'DELETE' : {

        properties: {
            godown_id: common.id
        },  
        required: ['godown_id']
        
    }
       
}


const products = {

    'GET': {
        properties: {
            product_id: common.id,
            limit: common.limit,
            offset: common.offset
        }
    },

    'POST' : {
        required: ['name','unit_id','description'],
        properties: {

            brand: common.name,
            type: {
                type: 'string',
                minLength: 1,
                maxLength: 10
            },
            name: common.name,
            unit_id: {
                type: 'string',
                minLength: 1,
                maxLength: 10
            },
            description: common.description,
            hsn_code: {
                type : 'integer',
                min: 1
            },
            
            igst: common.igst,
            cgst: common.cgst,
            sgst: common.sgst
        }
    },


    'PATCH' : {
        anyRequired: ['brand','type','name','unit_id','description','igst','cgst','sgst',
                'hsn_code'
            ],
        required: ['product_id'],
        properties: {
            product_id: common.id,
            brand: common.name,
            hsn_code: {
                type : 'integer',
                min: 1
            },
            type: {
                type: 'string',
                minLength: 1,
                maxLength: 10
            },
            name: common.name,
            unit_id: common.id,
            description: common.description,
        

            igst: common.igst,
            cgst: common.cgst,
            sgst: common.sgst

        },
        
    },  

    'DELETE' : {

        properties: {
            product_id: common.id
        },  
        required: ['product_id']
        
    }
       
}

const jobcards = {

    'GET': {
        properties: {
            jobcard_id: common.id,
            limit: common.limit,
            offset: common.offset
        }
    },

    'POST' : {
        type: 'object',
        allRequired: true,

        properties: {

            client_id: common.id,
            project_id: common.id,
            person_id: common.id,

            location: common.address,
            revision: common.id,
            site_supervisor: common.name,
            autocad_engineer: common.name,
            plan_approved_by: common.name,
            labour_contractor: common.name,

            products_headings: {
                type: 'array',
                "minItems": 1,
                "additionalItems": false,

                items: 
                {
                    type: 'object',
                    required: ['heading','pItems'],
                    properties: {
                        heading: common.name,
                        subheading: common.name,
                        pItems: {
                            type: 'array',
                            items: {
                                
                                properties: {
                                    pid: {
                                        type: 'integer',
                                        min: 1,
                                        
                                    },
                                    quantity: {
                                        type: 'number',
                                        "multipleOf": 0.01,
                                        minLength: 0,

                                        
                                    }
                                },
                                required: ['pid','quantity'],

                                }
                            
                        }
                    }
                }

            }

            
            
        }
    },


    'PATCH' : {
        anyRequired: [
            'client_id',
            'project_id',
            'person_id',
            
            'location',
            'revision',
            'site_supervisor',
            'autocad_engineer',
            'plan_approved_by',
            'labour_contractor',
            'products'

        ],
        required: ['jobcard_id'],
        properties: {

            client_id: common.id,
            project_id: common.id,
            person_id: common.id,

            location: common.address,
            revision: common.id,
            site_supervisor: common.name,
            autocad_engineer: common.name,
            plan_approved_by: common.name,
            labour_contractor: common.name,

            product_headings: {
                type: 'array',
                "minItems": 1,
                "additionalItems": false,
                items: 
                    {
                        type: 'object',
                        
                        properties: {
                            heading: common.name,
                            subheading: common.name,
                            pItems: {
                                type: 'array',
                                items: {
                                    
                                    properties: {
                                        pid: {
                                            type: 'integer',
                                            min: 1,
                                          
                                        },
                                        quantity: {
                                            type: 'number',
                                            "multipleOf": 0.01,
                                            minLength: 0,
                                            
                                        }
                                    },
                                    required: ['pid','quantity'],
   
                                    }
                                
                            }
                        }
                    }

            }

            
            
        }
        
    },

    'DELETE' : {

        properties: {
            jobcard_id: common.id
        },  
        required: ['jobcard_id']
        
    }
       
}

const vendors = {

    'GET': {
        properties: {
            vendor_id: common.id,
            limit: common.limit,
            offset: common.offset
        }
    },

    'POST' : {
        allRequired: true,
        properties: {

            name: common.name,
            mobile: {
                type: 'integer',
                minLength: 10,
                maxLength: 10
            },
            email: {
                type: 'string',
                format: 'email',    
                minLength: 3,
                maxLength: 128
            },
            address: common.address,
            gst_no: common.gst_no
        }
    },


    'PATCH' : {
        anyRequired: ['name','mobile','email','address','gst_no'],
        required: ['vendor_id'],
        properties: {
            vendor_id: common.id,
            name: common.name,
            mobile: {
                type: 'integer',
                minLength: 10,
                maxLength: 10
            },
            name: common.name,
            email: {
                type: 'string',
                format: 'email',    
                minLength: 3,
                maxLength: 128
            },
            address: common.address,
            gst_no: common.gst_no
            
        },
        
    },

    'DELETE' : {

        properties: {
            vendor_id: common.id
        },  
        required: ['vendor_id']
        
    }
       
}

const units = {

    'GET': {
        properties: {
            unit_id: common.id,
            limit: common.limit,
            offset: common.offset
        }
    },

    'POST' : {
        allRequired: true,
        properties: {

            name: common.name
        }
    },


    'PATCH' : {
        anyRequired: ['name'],
        required: ['unit_id'],
        properties: {
            unit_id: common.id,
            name: common.name,
            
        }
        
    },

    'DELETE' : {

        properties: {
            unit_id: common.id
        },  
        required: ['unit_id']
        
    }
       
}


const inventory = {

    'GET': {
        properties: {
            inventory_id: common.id,
            limit: common.limit,
            offset: common.offset,
            project_id: common.id,
            product_id : common.id
        }
    },

    'POST' : {
        allRequired: true,
        properties: {

            stock: {
                type: 'integer',
                minLength: 1,
                maxLength: 99999999
            },
            project_id: common.id,
            avg_rate: {
                type: 'number',
                minLength: 0
            },
            type: common.id,
            product_id: common.id
        }
    },


    'PATCH' : {
        anyRequired: ['stock','project_id','avg_rate','inventory_type','product_id'],
        required: ['inventory_id'],
        properties: {

            stock: {
                type: 'integer',
                minLength: 1,
                maxLength: 99999999
            },
            project_id: common.id,
            avg_rate: {
                type: 'number',
                minLength: 0
            },
            type: common.id,
            product_id: common.id
        }
        
    },

    'DELETE' : {

        properties: {
            inventory_id: common.id
        },  
        required: ['inventory_id']
        
    },
    'ACCEPT' : {
        properties: {
            po_id: common.id,
            products: common.po_products

        }
    },
    'PO': {
        properties: {
            po_id: common.id,
            products: common.po_products_delivery
        }
    }
    
       
}



const enums = {
    tax_type: [
        'all inclusive in price',
        'gst extra as applicable',
        'gst as mentioned'
    ],
    freight_tax: [
        'inclusive',
        'extra at actual'
    ]
}


const purchase_orders = {

    'GET': {
        properties: {
            po_id: common.id,
            limit: common.limit,
            offset: common.offset
        }
    },

    'POST' : {
        allRequired: true,
        properties: {

            ref: common.name,
            subject: common.name,
            date: common.name,
            tac: {
                type: 'object',
                allRequired: true,
                properties: {
                    tax_type: {
                        enum: enums.tax_type
                    },
                    tax_price: {
                        type: 'number',
                        minimum: 0.0000001
                    },
                    warranty: common.address,
                    payment: common.address,
                    delivery_period: {
                        type: 'integer',
                        minimum: 1
                    },
                    freight_tax: {
                        enum: enums.freight_tax
                    },
                    remarks: common.description
                    //additional_remark: common.description
                }
            }, 
            vendor_id : common.id,
            products: common.po_products         
            
        }
    },


    'PATCH' : {
        anyRequired: [
            'ref',
            'subject',
            'tac',
            'vendor_id',
            'products',
            'date'

        ],
        required: ['po_id'],
        properties: {
            po_id: common.id,
            tac_id: common.id,
		ref: common.name,
            subject: common.name,
            date: common.name ,
            tac: {
                type: 'object',
                properties: {
                    tax_type: {
                        enum: enums.tax_type
                    },
                    tax_price: {
                        type: 'number',
                        minimum: 0.0000001
                    },
                    warranty: common.address,
                    payment: common.address,
                    delivery_period: {
                        type: 'integer',
                        minimum: 1
                    },
                    freight_tax: {
                        enum: enums.freight_tax
                    },
                    remarks: common.description,
                    additional_remark: common.description
                }
            },
            vendor_id : common.id,
            products: common.po_products_patch
        }
        
    },

    'DELETE' : {

        properties: {
            po_id: common.id
        },  
        required: ['po_id']
        
    },
    'DELIVERY': {
        properties: {
            po_id: common.id,
            //products: common.po_products_delivery
        }
    }
       
}


const transfers = {

    type: 'array',
    "minItems": 1,
    "additionalItems": false,
    items: {

        required: ['stock','product_id','avg_rate',
                    ],

        stock: {
            type: 'number',
            minimum: 0
        },
        avg_rate: {
            type: 'number',
            minimum: 0
        },
        /*project_id: common.id, */
        product_id: common.id 
    }
    
}



const stock_transfer = {

    'GET': {
        properties: {
            st_id: common.id,
            limit: common.limit,
            offset: common.offset
        }
    },

    'POST' : {
        required:['sender','receiver','reason', 'transfers'],
        properties: {

            sender: common.id,
            receiver: common.id,
            status: {
                type: 'boolean'
            },
            transfers: transfers,
            reason: common.name
        }
    },


    'PATCH' : {
        anyRequired: ['sender','receiver','reason','transfers'],
        required: ['st_id'],
        properties: {
            st_id: common.id,
            sender: common.id,
            status: {
                type: 'boolean'
            },
            transfers: transfers,
            receiver: common.id,
            reason: common.name
        },
        
    },

    'DELETE' : {

        properties: {
            st_id: common.id
        },  
        required: ['st_id']
        
    },

    'ACCEPT' : {
        properties: {
            st_id: common.id

        }
    }
       
}


module.exports = {
    clients,
    projects,
    persons,
    godowns,
    products,
    jobcards,
    vendors,
    inventory,
    purchase_orders,
    stock_transfer,
    units,
    users
    
}
