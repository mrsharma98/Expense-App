import Transaction from "../models/transaction.model.js"

const transactionResolver = {
    Query: {
        transactions: async (_, __, context) => {
            try {
                if (!context.getUser()) {
                    throw new Error("Unauthorized")
                }

                const userId = await context.getUser()._id

                const transactions = await Transaction.find({ userId })
                console.log("transctionssss: ", transactions);

                return transactions
                
            } catch(err) {
                console.log('Error getting transactions: ', err);
                throw new Error("Error getting transactions")
            }
        },

        transaction: async (_, {transactionId}) => {
            try {
                const transaction = await Transaction.findById(transactionId)
                return transaction
                
            } catch(err) {
                console.log('Error getting transaction: ', err);
                throw new Error("Error getting transaction")
            }
        },

        // TODO => ADD categoryStatistics query
        categoryStatistics: async (_, __, context) => {
            if (!context.getUser()) throw new Error("Unauthorized")

            const userId = context.getUser()._id;
            console.log('user: ', userId);
            const transactions =await Transaction.find({ userId })
            console.log("Transactions user: ", transactions);

            const categoryMap = {}
            console.log("Started Category: ", categoryMap);
            transactions.forEach((transaction) => {
                if (!categoryMap[transaction.category]) {
                    categoryMap[transaction.category] = 0
                }
                categoryMap[transaction.category] += transaction.amount
            })
            console.log("CategpryMapp: ", categoryMap);
            return Object.entries(categoryMap).map(([category, amount]) => ({ category,totalAmount: amount }))
        }
    },

    Mutation: {
        createTransaction: async (_, {input}, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                })

                await newTransaction.save();
                return newTransaction

            } catch(err) {
                console.log('Error creating transaction: ', err);
                throw new Error("Error creating transaction")
            }
        },

        updateTransaction: async (_, {input}, context) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new:true})

                return updatedTransaction

            } catch(err) {
                console.log('Error updating transaction: ', err);
                throw new Error("Error updating transaction")
            }
        },
        deleteTransaction: async (_, {transactionId}, context) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId)

                return deletedTransaction

            } catch(err) {
                console.log('Error deleting transaction: ', err);
                throw new Error("Error deleting transaction")
            }
        },

        // TODO => ADD TRANSACTION/USER RELATIONSHIP
    }
}

export default transactionResolver