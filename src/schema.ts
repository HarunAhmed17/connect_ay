import { createSchema } from 'graphql-yoga'
import type { GraphQLContext } from './context'

const typeDefinitions = /* GraphQL */ `
  type Query {
    info: String!
    teams: [Team!]!
  }

  type Mutation {
    addTeam(name: String!, coach: String!, roster: Int!, city: String!): Team!
  }
 
  type Team {
    id: ID!
    name: String!
    coach: String!
    roster: Int!
    city: String!
  }
`

type Team = {
  id: string
  name: string
  coach: string
  roster: number
  city: string
}

const resolvers = {
  Query: {
    info: () => `This is the API of a Team management system`,
    teams: async (parent: unknown, args: {}, context: GraphQLContext) => {
      return context.prisma.team.findMany()
    }
  },
  Team: {
    id: (parent: Team) => parent.id,
    name: (parent: Team) => parent.name,
    coach: (parent: Team) => parent.coach,
    roster: (parent: Team) => parent.roster,
    city: (parent: Team) => parent.city
  },
  Mutation: {
    async addTeam(
      parent: unknown,
      args: { name: string; coach: string; roster: number; city: string },
      context: GraphQLContext
    ) {
      const newTeam = await context.prisma.team.create({
        data: {
          name: args.name,
          coach: args.coach,
          roster: args.roster,
          city: args.city
        }
      })
      return newTeam
    }
  }
}

export const schema = createSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})
