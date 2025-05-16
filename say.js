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
