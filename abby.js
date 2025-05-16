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
