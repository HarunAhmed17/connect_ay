import { createSchema } from 'graphql-yoga'
import type { GraphQLContext } from './context'

const typeDefinitions = /* GraphQL */ `
  type Query {
    info: String!
    teams: [Team!]!
    players: [Player!]!
  }

  type Mutation {
    addTeam(name: String!, coach: String!, roster: Int!, city: String!): Team!
    addPlayer(name: String!, age: Int!, position: String!, teamId: Int!): Player!
  }

  type Team {
    id: ID!
    name: String!
    coach: String!
    roster: Int!
    city: String!
    players: [Player!]!
  }

  type Player {
    id: ID!
    name: String!
    age: Int!
    position: String!
    team: Team!
  }
`

type Team = {
  id: string
  name: string
  coach: string
  roster: number
  city: string
  players: Player[]
}

type Player = {
  id: string
  name: string
  age: number
  position: string
  team: Team
}

const resolvers = {
  Query: {
    info: () => `This is the API of a Team management system`,
    teams: async (parent: unknown, args: {}, context: GraphQLContext) => {
      return context.prisma.team.findMany({
        include: { players: true }
      })
    },
    players: async (parent: unknown, args: {}, context: GraphQLContext) => {
      return context.prisma.player.findMany()
    }
  },
  Team: {
    players: (parent: Team, args: {}, context: GraphQLContext) => {
      return context.prisma.player.findMany({
        where: { teamId: parent.id }
      })
    }
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
    },
    async addPlayer(
      parent: unknown,
      args: { name: string; age: number; position: string; teamId: number },
      context: GraphQLContext
    ) {
      const newPlayer = await context.prisma.player.create({
        data: {
          name: args.name,
          age: args.age,
          position: args.position,
          teamId: args.teamId
        }
      })
      return newPlayer
    }
  }
}

export const schema = createSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})
