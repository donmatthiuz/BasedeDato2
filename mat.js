// Ejercicio 1

[
  {
    $unwind: {
      path: "$items",
      includeArrayIndex: "itemIndex",
      // opcional
      preserveNullAndEmptyArrays: false // opcional
    }
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$items.menu_item_id",
        cantidad_total_vendida: {
          $sum: "$items.quantity"
        }
      }
  },
  {
    $lookup: {
      from: "menu_items",
      localField: "_id",
      foreignField: "_id",
      as: "item_data"
    }
  },
  {
    $unwind: {
      path: "$item_data",
      includeArrayIndex: "itemIndex",
      // opcional
      preserveNullAndEmptyArrays: false
    }
  },
  {
    $project: {
      _id: 0,
      nombre_producto: "$item_data.name",
      cantidad_total_vendida: 1
    }
  },
  {
    $sort: {
      cantidad_total_vendida: -1
    }
  },
  {
    $limit:
      /**
       * Provide the number of documents to limit.
       */
      5
  }
]


// Ejercicio 2

[
  {
    $match: {
      created_at: {
        $gte: "2025-05-01T00:00:00.000000",
        $lte: "2025-05-06T23:59:59.999999"
      }
    }
  },
  {
    $group: {
      _id: "$customer_id",
      pedidos_count: {
        $sum: 1
      }
    }
  },
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        pedidos_count: {
          $gte: 2
        }
      }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "nombre"
    }
  },
  {
    $unwind: {
      path: "$nombre",
      includeArrayIndex: "itemIndex",
      preserveNullAndEmptyArrays: false
    }
  },
  {
    $project: {
      _id: 0,
      usuario: "$nombre.name"
    }
  }
]


// 3. Obtener todas las sucursales que tienen pedidos en estado "entregado", incluyendo el total de pedidos por sucursal
db.orders.countDocuments({status: "entregado"})
db.orders.countDocuments({})


//4. Calcula el ingreso total generado por cada restaurante en el último mes (mostrar el nombre del restaurante y el total, usando $lookup, $unwind, $project y $group).
db.orders.aggregate([
  {
    $addFields: {
      //convert fecha
      order_date: { $toDate: "$created_at" }
    }
  },
  {
    $match: {
      status: "entregado",
      order_date: {  //8 mayo
        $gte: ISODate("2025-04-08T00:00:00Z"),
        $lte: ISODate("2025-05-08T23:59:59Z")
      }
    }
  },
  {
    $lookup: {
      from: "restaurants",
      localField: "restaurant_id",
      foreignField: "_id",
      as: "restaurant_info"
    }
  },
  {
    $unwind: "$restaurant_info"
  },
  {
    $lookup: {
      from: "menu_items",
      localField: "items.menu_item_id",
      foreignField: "_id",
      as: "menu_items_info"
    }
  },
  {
    $addFields: {
      order_total: {
        $sum: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              $let: {
                vars: {
                  menu_item: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$menu_items_info",
                          as: "mi",
                          cond: { $eq: ["$$mi._id", "$$item.menu_item_id"] }
                        }
                      },
                      0
                    ]
                  }
                },
                in: { $multiply: ["$$menu_item.price", "$$item.quantity"] }
              }
            }
          }
        }
      }
    }
  },
  {
    $group: {
      _id: "$restaurant_info.name",
      total_revenue: { $sum: "$order_total" },
      total_orders: { $sum: 1 }
    }
  },
  {
    $sort: { total_revenue: -1 }
  },
  {
    $project: {
      _id: 0,
      restaurant_name: "$_id",
      total_revenue: 1,
      total_orders: 1
    }
  }
])

// Iniciso 5

[
  {
    $group: {
      _id: "$restaurant_id",
      cantidad_resenas: {
        $sum: 1
      }
    }
  },
  {
    $lookup: {
      from: "restaurants",
      localField: "_id",
      foreignField: "_id",
      as: "result"
    }
  },
  {
    $unwind: {
      path: "$result",
      includeArrayIndex: "resultindex",
      preserveNullAndEmptyArrays: false
    }
  },
  {
    $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        _id: 0,
        restaurante: "$result.name",
        resenas: "$cantidad_resenas",
        promedio_resenas: "$result.average_rating"
      }
  },
  {
    $sort:
      /**
       * Provide any number of field/order pairs.
       */
      {
        promedio_resenas: -1
      }
  },
  {
    $limit:
      /**
       * Provide the number of documents to limit.
       */
      3
  }
]


// 6.	Por cada categoría de producto, calcular el precio promedio de los productos y el número total de productos por categoría
db.menu_items.aggregate([
  {
    $group:{
  		_id: "$category",
			promedio: {$avg: "$price"},
  		total: {$sum: 1}
    }
  },
  {
		 $project: {
      _id: 0,
      categoria: "$_id",
      precio_promedio: { $round: ["$promedio", 2] },
			cantidad: "$total"
     }
	},
  {
  	$sort: {cantidad: -1}
  }
])


/*
Inciso 7: Obtención de total de ordenes, total ganancias y calificación promedio por sucursal de restaurantes.
  Este Pipeline fue aplicado sobre la colección “restaurants” en la sección de “Aggregations” con 19 resultados.
*/

[
  {
    $unwind:
      // Obtener cada sucursal
      {
        path: "$branches"
      }
  },
  {
    $lookup:
      // Join con orders para ver el total de pedidos entregados
      {
        from: "orders",
        localField: "branches.branch_id",
        foreignField: "branch_id",
        as: "branch_orders"
      }
  },
  {
    $lookup:
      // Join con reviews para ver el promedio de calificación
      {
        from: "reviews",
        let: {
          branchId: "$branches.branch_id"
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$branch_id", "$$branchId"]
              }
            }
          }
        ],
        as: "branch_reviews"
      }
  },
  {
    $addFields:
      // Obtener el total de ordenes entregados dado por el status "entregado"
      {
        "branches.total_orders_delivered": {
          $size: {
            $filter: {
              input: "$branch_orders",
              as: "order",
              cond: {
                $eq: [
                  "$$order.status",
                  "entregado"
                ]
              }
            }
          }
        }
      }
  },
  {
    $lookup:
      // join con menu_items para traer información del plato de la orden en estado "entregado" haciendo busqueda por _id de order de
      {
        from: "menu_items",
        let: {
          orders: {
            $filter: {
              input: "$branch_orders",
              as: "order",
              cond: {
                $eq: [
                  "$$order.status",
                  "entregado"
                ]
              }
            }
          }
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: [
                  "$_id",
                  {
                    $reduce: {
                      input: "$$orders",
                      initialValue: [],
                      in: {
                        $setUnion: [
                          "$$value",
                          "$$this.items.menu_item_id"
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
        ],
        as: "menu_items_data"
      }
  },
  {
    $addFields:
      // Crear el total de ingresos por ordenes con status "entregado"
      {
        "branches.total_income": {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: "$branch_orders",
                  as: "order",
                  cond: {
                    $eq: [
                      "$$order.status",
                      "entregado"
                    ]
                  }
                }
              },
              as: "order",
              in: {
                $sum: {
                  $map: {
                    input: "$$order.items",
                    as: "item",
                    in: {
                      $let: {
                        vars: {
                          menu_item: {
                            $first: {
                              $filter: {
                                input:
                                  "$menu_items_data",
                                as: "menu",
                                cond: {
                                  $eq: [
                                    "$$menu._id",
                                    "$$item.menu_item_id"
                                  ]
                                }
                              }
                            }
                          }
                        },
                        in: {
                          $multiply: [
                            "$$item.quantity",
                            "$$menu_item.price"
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
  },
  {
    $addFields:
      // Promedio de calificación por sucursal dado el join (lookup) iniciañ
      {
        "branches.average_rating": {
          $cond: [
            {
              $gt: [
                {
                  $size: "$branch_reviews"
                },
                0
              ]
            },
            {
              $avg: "$branch_reviews.rating"
            },
            null
          ]
        }
      }
  },
  {
    $project:
      // Trear datos que importan
      {
        _id: 0,
        restaurant_name: "$name",
        branch_id: "$branches.branch_id",
        branch_name: "$branches.name",
        total_income: "$branches.total_income",
        total_orders_delivered:
          "$branches.total_orders_delivered",
        average_rating: "$branches.average_rating"
      }
  }
]


// Ejercicio 8

db.restaurants.insertOne({
  name: "Pollo Campero",
  average_rating: 0,
  branches: [
    {
      branch_id: "a56145bd-a08c-40cd-aba2-0c8c9af7faa7",
      name: "Pollo Campero Metronorte",
      address: "Carretera al Atlántico, Cdad. de Guatemala",
      phone: "+502 5812-6208"
    },
    {
      branch_id: "b3e80c67-22c6-4206-a5f0-15c93c7b4a42",
      name: "Pollo Campero Portales",
      address: "Carretera al Atlántico, Cdad. de Guatemala",
      phone: "+502 5864 8184"
    },
    
  ]
});


/*
Inciso 9: Colocar nuevo atributo VIP para usuarios que han pedido más de 5 ordenes (entregadas).
  Este Pipeline fue aplicado sobre la colección “users” en la sección de “Aggregations” con 50 resultados.
  Como nota en este punto los usuarios VIP son los que han ordenado 5 pedidos, pero estos han sido entregados para ello se muestran los campos total_orders y delivered_orders para demostrar el campo vip sobre dichos usuarios. 
*/

[
  {
    $lookup: {
      // Realiza un join entre 'users' y 'orders' usando el campo 'customer_id'.
      from: "orders",
      localField: "_id",
      foreignField: "customer_id",
      as: "user_orders" // Guarda las órdenes del usuario en este campo.
    }
  },
  {
    $addFields: {
      // Calcula la cantidad total de órdenes realizadas por el usuario.
      total_orders: {
        $size: "$user_orders"
      },
      // Calcula la cantidad de órdenes con estado 'entregado'.
      delivered_orders: {
        $size: {
          $filter: {
            input: "$user_orders",
            // Analiza las órdenes del usuario.
            as: "order",
            cond: {
              $eq: ["$$order.status", "entregado"] // Filtra solo las entregadas.
            }
          }
        }
      },
      // Determina si el usuario es VIP: si tiene más de 5 órdenes en total.
      vip: {
        $gt: [
          {
            $size: "$user_orders"
          },
          // Comprueba si total de órdenes > 5.
          5
        ]
      }
    }
  },
  {
    $project: {
      // Proyección de los campos finales a mostrar.
      _id: 1,
      name: 1,
      email: 1,
      role: 1,
      vip: 1,
      total_orders: 1,
      delivered_orders: 1
    }
  }
]
