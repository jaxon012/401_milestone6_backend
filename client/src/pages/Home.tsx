import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { ArrowRight, Flame, Trophy, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      {/* Hero Progress Section */}
      <section className="mb-8">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-primary to-accent rounded-3xl p-6 text-white shadow-lg shadow-primary/25 relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-6 -mb-6" />

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium mb-1">Weekly Streak</p>
              <h2 className="text-3xl font-display font-bold">4/7 Days</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <Flame className="w-8 h-8 text-orange-300 fill-orange-300 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex justify-between text-xs font-medium text-primary-foreground/70">
              <span>Keep going!</span>
              <span>57%</span>
            </div>
            <div className="h-3 bg-black/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "57%" }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/vocab">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="cursor-pointer group">
            <div className="bg-card hover:bg-card/80 border border-border/50 rounded-2xl p-5 shadow-sm transition-all h-full flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Daily Vocab</h3>
                <p className="text-xs text-muted-foreground mt-1">20 new words</p>
              </div>
            </div>
          </motion.div>
        </Link>

        <Link href="/read">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="cursor-pointer group">
            <div className="bg-card hover:bg-card/80 border border-border/50 rounded-2xl p-5 shadow-sm transition-all h-full flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Practice</h3>
                <p className="text-xs text-muted-foreground mt-1">Reading & Quiz</p>
              </div>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* Featured Adventure */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Continue Journey</h3>
          <Link href="/adventure" className="text-sm text-primary font-medium hover:underline">View All</Link>
        </div>

        <Link href="/adventure">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="cursor-pointer">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md group relative">
              <div className="h-32 bg-gray-100 relative overflow-hidden">
                {/* Placeholder for dynamic scene image - using gradient for now */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white/20" />
                </div>
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium text-white border border-white/10">
                  Level 3
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">The Lost Temple</h3>
                    <p className="text-sm text-muted-foreground">Interactive Story</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 mt-3">
                  <div className="bg-primary h-1.5 rounded-full w-[35%]" />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </section>
    </Layout>
  );
}
